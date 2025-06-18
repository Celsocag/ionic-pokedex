import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Serviço para gerenciar o filtro de tipo de Pokémon aplicado na listagem.
 * Utiliza BehaviorSubject para reatividade.
 */
@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private filterSubject = new BehaviorSubject<string | null>(null);
  filter$ = this.filterSubject.asObservable();

  setFilter(type: string | null) {
    this.filterSubject.next(type);
  }

  get currentFilter(): string | null {
    return this.filterSubject.value;
  }
}
