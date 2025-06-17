import { Component, EventEmitter, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokemon-filter',
  templateUrl: './pokemon-filter.component.html',
  standalone: true,
  imports: [IonicModule, FormsModule],
  styleUrls: ['./pokemon-filter.component.scss']
})
export class PokemonFilterComponent {
  filterText = '';

  @Output() filterChanged = new EventEmitter<string>();

  onFilterChange() {
    this.filterChanged.emit(this.filterText.trim().toLowerCase());
  }
}
