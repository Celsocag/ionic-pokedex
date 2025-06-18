import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, forkJoin } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';
import { FilterService } from './filter.service';

/**
 * Serviço responsável por buscar, filtrar e cachear dados dos Pokémons usando a PokéAPI.
 * Também fornece métodos para buscar detalhes e espécies de um Pokémon.
 */
@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';
  private allPokemonsCache: Pokemon[] | null = null;
  private allPokemonsByTypeCache: { [type: string]: Pokemon[] } = {};

  constructor(
    private http: HttpClient,
    private filterService: FilterService
  ) {}

  private extractIdFromUrl(url: string): number {
    const parts = url.split('/');
    return +parts[parts.length - 2];
  }

  private loadAllPokemons(): Observable<Pokemon[]> {
    if (this.allPokemonsCache) {
      return of(this.allPokemonsCache);
    }

    return this.http.get<any>(`${this.baseUrl}/pokemon?limit=10000`).pipe(
      map(response => response.results),
      map((results: any[]) =>
        results.map(item => {
          const id = this.extractIdFromUrl(item.url);
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
          return {
            name: item.name,
            url: item.url,
            id,
            imageUrl,
            types: [],
            abilities: [],
            stats: [],
            images: []
          };
        })
      ),
      map(pokemons => {
        this.allPokemonsCache = pokemons;
        return pokemons;
      })
    );
  }

  /**
   * Busca uma lista paginada de Pokémons, aplicando filtro por nome e tipo.
   * Utiliza cache local para otimizar requisições.
   * @param limit Quantidade de pokémons por página
   * @param offset Posição inicial
   * @param nameFilter Filtro por nome (opcional)
   */
  getPokemons(
    limit: number,
    offset: number,
    nameFilter: string = ''
  ): Observable<{ pokemons: Pokemon[]; total: number }> {
    const typeFilter = this.filterService.currentFilter;

    if (typeFilter) {
      if (this.allPokemonsByTypeCache[typeFilter]) {
        return of(this.paginateAndFilter(this.allPokemonsByTypeCache[typeFilter], limit, offset, nameFilter));
      } else {
        return this.http.get<any>(`${this.baseUrl}/type/${typeFilter}`).pipe(
          map(response => {
            const pokemons = response.pokemon.map((p: any) => {
              const id = this.extractIdFromUrl(p.pokemon.url);
              const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
              return {
                name: p.pokemon.name,
                url: p.pokemon.url,
                id,
                imageUrl,
                types: [typeFilter],
                abilities: [],
                stats: [],
                images: []
              };
            });
            this.allPokemonsByTypeCache[typeFilter] = pokemons;
            return this.paginateAndFilter(pokemons, limit, offset, nameFilter);
          })
        );
      }
    }

    return this.loadAllPokemons().pipe(
      map(pokemons => this.paginateAndFilter(pokemons, limit, offset, nameFilter))
    );
  }

  private paginateAndFilter(pokemons: Pokemon[], limit: number, offset: number, nameFilter: string) {
    let filtered = pokemons;

    if (nameFilter.trim()) {
      const term = nameFilter.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
    }

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);
    return { pokemons: paginated, total };
  }

  refreshCache() {
    this.allPokemonsCache = null;
    this.allPokemonsByTypeCache = {};
  }

  getPokemonSpecies(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon-species/${id}`);
  }

  /**
   * Busca detalhes completos de um Pokémon, combinando dados da PokéAPI e species.
   * Utiliza forkJoin para requisições paralelas.
   * @param id ID do Pokémon
   */
  getPokemonDetails(id: number): Observable<Pokemon> {
    const pokemon$ = this.http.get<any>(`${this.baseUrl}/pokemon/${id}`);
    const species$ = this.getPokemonSpecies(id);

    return forkJoin({ pokemon: pokemon$, species: species$ }).pipe(
      map(({ pokemon, species }) => {
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
        const sprites = pokemon.sprites || {};
        const images = [
          sprites.front_default,
          sprites.back_default,
          sprites.front_shiny,
          sprites.back_shiny,
        ].filter(Boolean);

        const flavorEntry = species.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'en'
        );
        const description = flavorEntry ? flavorEntry.flavor_text.replace(/\f/g, ' ') : 'No description available.';

        const habitat = species.habitat ? species.habitat.name : 'Unknown';
        const generation = species.generation ? species.generation.name.replace('-', ' ') : 'Unknown';

        return {
          name: pokemon.name,
          url: `${this.baseUrl}/pokemon/${pokemon.id}`,
          id: pokemon.id,
          imageUrl,
          types: pokemon.types.map((t: any) => t.type.name),
          abilities: pokemon.abilities.map((a: any) => a.ability.name),
          stats: pokemon.stats.map((s: any) => ({
            name: s.stat.name,
            value: s.base_stat,
          })),
          images,
          description,
          habitat,
          generation
        };
      })
    );
  }
}
