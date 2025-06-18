import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pokemon-filter-menu',
  templateUrl: './pokemon-filter-menu.component.html',
  styleUrls: ['./pokemon-filter-menu.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class PokemonFilterMenuComponent {
  @Output() filterChanged = new EventEmitter<string | null>();

  tipos: string[] = [
    'normal', 'fire', 'water', 'grass', 'electric',
    'ice', 'fighting', 'poison', 'ground', 'flying',
    'psychic', 'bug', 'rock', 'ghost', 'dragon',
    'dark', 'steel', 'fairy'
  ];

  selectedType: string | null = null;

  onTypeSelected(event: CustomEvent, tipo: string): void {
    const checked = event.detail.checked;
    if (checked) {
      this.selectedType = tipo;
      this.filterChanged.emit(this.selectedType);
    } else {
      this.selectedType = null;
      this.filterChanged.emit(null);
    }
  }
}
