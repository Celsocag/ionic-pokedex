import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { FavoritesService } from '../../services/favorites.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { Pokemon } from 'src/models/pokemon.model';
import { PokemonCardComponent } from 'src/app/components/pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [IonicModule, CommonModule, PokemonCardComponent],
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit, OnDestroy {
  favorites: Pokemon[] = [];
  favoriteIds: number[] = [];
  private sub?: Subscription;
  isLoading = true;

  constructor(
    private favoritesService: FavoritesService,
    private pokemonService: PokemonService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.sub = this.favoritesService.favorites$.subscribe(ids => {
      this.favoriteIds = ids;
      this.loadFavoritePokemons();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  async loadFavoritePokemons() {
    this.isLoading = true;
    const promises = this.favoriteIds.map(id =>
      firstValueFrom(this.pokemonService.getPokemonDetails(id))
    );
    try {
      this.favorites = await Promise.all(promises);
    } catch (error) {
      console.error('Erro ao carregar Pokémon favoritos:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async toggleFavorite(pokemon: Pokemon) {
    await this.favoritesService.toggleFavorite(pokemon.id);
  }

  openDetails(pokemon: Pokemon) {
    this.navCtrl.navigateForward(`/details/${pokemon.id}`);
  }

  trackByPokemonId(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }
}
