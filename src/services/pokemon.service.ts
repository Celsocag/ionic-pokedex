import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';
import { FilterService } from './filter.service';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';
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

    return this.http.get<any>(`${this.baseUrl}?limit=10000&offset=0`).pipe(
      map(response => response.results),
      map(results =>
        results.map((item: any) => {
          const id = this.extractIdFromUrl(item.url);
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
          return new Pokemon(item.name, item.url, id, imageUrl);
        })
      ),
      map(pokemons => {
        this.allPokemonsCache = pokemons;
        return pokemons;
      })
    );
  }

  getPokemons(
    limit = 20,
    offset = 0,
    nameFilter: string = ''
  ): Observable<{ pokemons: Pokemon[]; total: number }> {
    const typeFilter = this.filterService.currentFilter;

    if (typeFilter) {
      if (this.allPokemonsByTypeCache[typeFilter]) {
        // Usa cache e faz paginação local
        return of(this.paginateAndFilter(this.allPokemonsByTypeCache[typeFilter], limit, offset, nameFilter));
      } else {
        // Busca da API, cacheia e retorna página
        return this.http.get<any>(`https://pokeapi.co/api/v2/type/${typeFilter}`).pipe(
          map(response => {
            const pokemons = response.pokemon.map((p: any) => {
              const id = this.extractIdFromUrl(p.pokemon.url);
              const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
              return new Pokemon(p.pokemon.name, p.pokemon.url, id, imageUrl, [typeFilter]);
            });
            this.allPokemonsByTypeCache[typeFilter] = pokemons;
            return this.paginateAndFilter(pokemons, limit, offset, nameFilter);
          })
        );
      }
    } else {
      // Busca geral, como antes
      return this.loadAllPokemons().pipe(
        map(pokemons => this.paginateAndFilter(pokemons, limit, offset, nameFilter))
      );
    }
  }

  private paginateAndFilter(pokemons: Pokemon[], limit: number, offset: number, nameFilter: string) {
    let filtered = pokemons;
    if (nameFilter.trim().length > 0) {
      const filterLower = nameFilter.trim().toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(filterLower));
    }
    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);
    return { pokemons: paginated, total };
  }

  refreshCache(): void {
    this.allPokemonsCache = null;
    this.allPokemonsByTypeCache = {};
  }

  getPokemonDetails(id: number): Observable<Pokemon> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(data => {
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;

        const sprites = data.sprites || {};
        const images: string[] = [];

        if (sprites.front_default) images.push(sprites.front_default);
        if (sprites.back_default) images.push(sprites.back_default);
        if (sprites.front_shiny) images.push(sprites.front_shiny);
        if (sprites.back_shiny) images.push(sprites.back_shiny);

        return {
          name: data.name,
          url: `${this.baseUrl}/${data.id}`,
          id: data.id,
          imageUrl,
          types: Array.isArray(data.types)
            ? data.types.map((t: any) => t?.type?.name ?? 'Unknown')
            : [],
          abilities: Array.isArray(data.abilities)
            ? data.abilities.map((a: any) => a?.ability?.name ?? 'Unknown')
            : [],
          stats: Array.isArray(data.stats)
            ? data.stats.map((s: any) => ({
                name: s?.stat?.name ?? 'Unknown',
                value: s?.base_stat ?? 0,
              }))
            : [],
          images,
          description: '', // Pode completar se quiser
          habitat: 'Unknown',
          generation: 'Unknown'
        } as Pokemon;
      })
    );
  }
}
