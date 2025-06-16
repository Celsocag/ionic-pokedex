import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';
import { NavController } from '@ionic/angular';
import { FavoritesService } from '../../services/favorites.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.page.html',
})
export class HomePage implements OnInit, OnDestroy {
  pokemons: Pokemon[] = [];
  isLoading = true;
  searchTerm: string = '';
  offset = 0;
  limit = 20;
  total = 0;

  favoriteIds: number[] = [];
  private favoritesSub?: Subscription;

  constructor(
    private pokemonService: PokemonService,
    private navCtrl: NavController,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.loadPokemons();

    this.favoritesSub = this.favoritesService.favorites$.subscribe(ids => {
      this.favoriteIds = ids;
    });
  }

  ngOnDestroy() {
    this.favoritesSub?.unsubscribe();
  }

  loadPokemons(event?: any) {
    if (!event) {
      this.isLoading = true;
    }

    this.pokemonService.getPokemons(this.limit, this.offset).subscribe({
      next: ({ pokemons, total }) => {
        this.pokemons = [...this.pokemons, ...pokemons];
        this.total = total;
        this.offset += this.limit;

        if (!event) {
          this.isLoading = false;
        }
        if (event) {
          event.target.complete();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar Pokémon', err);
        if (!event) {
          this.isLoading = false;
        }
        if (event) {
          event.target.complete();
        }
      },
    });
  }

  canLoadMore(): boolean {
    return this.offset < this.total;
  }

  openDetails(pokemon: Pokemon) {
    const id = pokemon.getId();
    this.navCtrl.navigateForward(`/details/${id}`);
  }

  async toggleFavorite(pokemon: Pokemon) {
    await this.favoritesService.toggleFavorite(+pokemon.getId());
  }

  isFavorite(pokemon: Pokemon): boolean {
    return this.favoriteIds.includes(+pokemon.getId());
  }
}
