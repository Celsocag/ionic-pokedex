import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';
import { NavController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.page.html',
})
export class HomePage implements OnInit {
  pokemons: Pokemon[] = [];
  isLoading = true;
  searchTerm: string = '';

  offset = 0;
  limit = 20;
  total = 0;

  constructor(private pokemonService: PokemonService, private navCtrl: NavController) { }

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons(event?: any) {
    if (!event) { // primeira carga
      this.isLoading = true;
    }

    this.pokemonService.getPokemons(this.limit, this.offset).subscribe({
      next: ({ pokemons, total }) => {
        this.pokemons = [...this.pokemons, ...pokemons];
        this.total = total;
        this.offset += this.limit;
        if (!event) {
          this.isLoading = false;
        }
        if (event) {
          event.target.complete();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar Pokémon', err);
        if (!event) {
          this.isLoading = false;
        }
        if (event) {
          event.target.complete();
        }
      },
    });
  }

  canLoadMore(): boolean {
    return this.offset < this.total;
  }

}
