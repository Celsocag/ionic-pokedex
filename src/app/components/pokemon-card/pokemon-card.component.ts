import { Component, NgModule, Input, Output, EventEmitter } from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;
  @Input() isFavorite: boolean = false;

  @Output() toggleFavorite = new EventEmitter<Pokemon>();
  @Output() openDetails = new EventEmitter<Pokemon>();

  onToggleFavorite(event: Event) {
    event.stopPropagation();
    this.toggleFavorite.emit(this.pokemon);
  }

  onOpenDetails() {
    this.openDetails.emit(this.pokemon);
  }
}
