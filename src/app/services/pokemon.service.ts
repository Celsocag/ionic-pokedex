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

  getPokemons(limit = 20, offset = 0): Observable<{ pokemons: Pokemon[]; total: number }> {
    return this.http.get<any>(`${this.baseUrl}?limit=${limit}&offset=${offset}`).pipe(
      map(response => {
        const pokemons = response.results.map(
          (item: any) => new Pokemon(item.name, item.url)
        );
        const total = response.count;
        return { pokemons, total };
      })
    );
  }
}
