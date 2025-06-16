import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';
import { NavController } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-home',
  templateUrl: './home.page.html',

})
export class HomePage implements OnInit {
 pokemons: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];
  isLoading = true;
  searchTerm: string = '';

  constructor(private pokemonService: PokemonService, private navCtrl: NavController) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.isLoading = true;
    this.pokemonService.getPokemons().subscribe({
      next: (pokemons) => {
        this.pokemons = pokemons;
        this.filteredPokemons = pokemons;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar Pokémon', err);
        this.isLoading = false;
      },
    });
  }

  filterPokemons() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredPokemons = this.pokemons;
    } else {
      this.filteredPokemons = this.pokemons.filter(p =>
        p.name.toLowerCase().includes(term)
      );
    }
  }

  openDetails(pokemon: Pokemon) {
    // Exemplo: navegar para página de detalhes (se existir)
    this.navCtrl.navigateForward(`/details/${pokemon.getId()}`);
  }
}
