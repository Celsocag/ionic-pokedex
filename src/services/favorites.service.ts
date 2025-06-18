import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

/**
 * Serviço para gerenciar a lista de Pokémons favoritos do usuário.
 * Utiliza storage local e BehaviorSubject para reatividade.
 */
@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private storageKey = 'favorites';
  private favoritesSubject = new BehaviorSubject<number[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    const favorites = await this.storage.get(this.storageKey) || [];
    this.favoritesSubject.next(favorites);
  }

  async getFavorites(): Promise<number[]> {
    return this.favoritesSubject.value;
  }

  /**
   * Adiciona ou remove um Pokémon da lista de favoritos.
   * Atualiza o storage e o BehaviorSubject.
   * @param id ID do Pokémon
   */
  async toggleFavorite(id: number) {
    let favorites = this.favoritesSubject.value;
    if (favorites.includes(id)) {
      favorites = favorites.filter(fav => fav !== id);
    } else {
      favorites = [...favorites, id];
    }
    await this.storage.set(this.storageKey, favorites);
    this.favoritesSubject.next(favorites);
  }

  async isFavorite(id: number): Promise<boolean> {
    return this.favoritesSubject.value.includes(id);
  }
}
