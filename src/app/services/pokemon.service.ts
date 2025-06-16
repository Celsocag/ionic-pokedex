import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  private extractIdFromUrl(url: string): number {
    const parts = url.split('/');
    return +parts[parts.length - 2];
  }

  getPokemons(limit = 20, offset = 0): Observable<{ pokemons: Pokemon[]; total: number }> {
    return this.http.get<any>(`${this.baseUrl}?limit=${limit}&offset=${offset}`).pipe(
      map(response => {
        const pokemons = response.results.map(
          (item: any) => {
            const id = this.extractIdFromUrl(item.url);
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
            return new Pokemon(item.name, item.url, id, imageUrl);
          }
        );
        const total = response.count;
        return { pokemons, total };
      })
    );
  }

getPokemonDetails(id: number): Observable<Pokemon> {
  return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
    map(data => {
      const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;
      return new Pokemon(data.name, `${this.baseUrl}/${data.id}`, data.id, imageUrl);
    })
  );
}

}
