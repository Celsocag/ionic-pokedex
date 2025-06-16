import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: false,
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  pokemons: Pokemon[] = [];

  constructor() { }


  ngOnInit() {
    console.log(this.pokemons)
  }

}
