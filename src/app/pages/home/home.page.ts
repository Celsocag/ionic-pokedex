import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  standalone:false,
  selector: 'app-home',
  templateUrl: './home.page.html',

})
export class HomePage implements OnInit {
  pokemons: Pokemon[] = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.pokemonService.getPokemons().subscribe(pokemons => {
      this.pokemons = pokemons;

      console.log(this.pokemons)
    });
  }
}
