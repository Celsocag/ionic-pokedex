import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../../services/pokemon.service';
import { FavoritesService } from '../../../services/favorites.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  standalone: false,
})
export class DetailsPage implements OnInit, OnDestroy {
  pokemon: any;
  isLoading = true;

  favoriteIds: number[] = [];
  private favoritesSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPokemonDetails(id);

    this.favoritesSub = this.favoritesService.favorites$.subscribe(favs => {
      this.favoriteIds = favs;
    });
  }

  ngOnDestroy() {
    this.favoritesSub?.unsubscribe();
  }

  loadPokemonDetails(id: number) {
    this.pokemonService.getPokemonDetails(id).subscribe({
      next: (data) => {
        this.pokemon = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes:', err);
        this.isLoading = false;
      },
    });
  }

  isFavorite(pokemon: any): boolean {
    return this.favoriteIds.includes(pokemon.id);
  }

  async toggleFavorite(pokemon: any) {
    await this.favoritesService.toggleFavorite(pokemon.id);
  }
}
