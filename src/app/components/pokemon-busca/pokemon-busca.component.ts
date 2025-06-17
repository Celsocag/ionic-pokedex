import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-pokemon-busca',
  templateUrl: './pokemon-busca.component.html',
  styleUrls: ['./pokemon-busca.component.scss'],
})
export class PokemonBuscaComponent {

  @Output() searchChange = new EventEmitter<string>();

  onInput(event: any) {
    const valor = event.target.value ? event.target.value.trim() : '';
    this.searchChange.emit(valor);
  }
}
