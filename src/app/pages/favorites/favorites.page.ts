import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { FavoritesService } from '../../services/favorites.service';
import { NavController } from '@ionic/angular';
import { Subscription, firstValueFrom } from 'rxjs';
import { Pokemon } from 'src/app/models/pokemon.model';

@Component({
  selector: 'app-favorites',
  standalone: false,
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit, OnDestroy {
  favorites: Pokemon[] = [];
  favoriteIds: number[] = [];
  private sub?: Subscription;
  isLoading: boolean = true;

  constructor(
    private favoritesService: FavoritesService,
    private pokemonService: PokemonService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.sub = this.favoritesService.favorites$.subscribe((ids) => {
      this.favoriteIds = ids;
      this.loadFavoritePokemons();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

async loadFavoritePokemons() {
  this.isLoading = true;
  const promises = this.favoriteIds.map((id) =>
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

  async toggleFavorite(pokemonId: number) {
    await this.favoritesService.toggleFavorite(pokemonId);
  }

  openDetails(pokemonId: number) {
    this.navCtrl.navigateForward(`/details/${pokemonId}`);
  }
}
