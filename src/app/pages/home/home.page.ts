import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonService } from '../../../services/pokemon.service';
import { Pokemon } from '../../../models/pokemon.model';
import { NavController } from '@ionic/angular';
import { FavoritesService } from '../../../services/favorites.service';
import { Subscription } from 'rxjs';
import { PokemonCardComponent } from 'src/app/components/pokemon-card/pokemon-card.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonFilterComponent } from 'src/app/components/pokemon-filter/pokemon-filter.component';
import { PokemonFilterMenuComponent } from 'src/app/components/pokemon-filter-menu/pokemon-filter-menu.component';
import { FilterService } from '../../../services/filter.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    PokemonCardComponent,
    PokemonFilterComponent,
    PokemonFilterMenuComponent,
    IonicModule,
    CommonModule,
    FormsModule,
  ],
})
export class HomePage implements OnInit, OnDestroy {
  pokemons: Pokemon[] = [];
  isLoading = true;
  isFetching = false;
  offset = 0;
  limit = 20;
  total = 0;
  errorMessage = '';
  favoriteIds: number[] = [];
  private favoritesSub?: Subscription;
  private filterSub?: Subscription;
  private currentFilter: string | null = null;

  constructor(
    private pokemonService: PokemonService,
    private navCtrl: NavController,
    private favoritesService: FavoritesService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    // Escuta filtro global
    this.filterSub = this.filterService.filter$.subscribe(filter => {
      if (this.currentFilter !== filter) {
        this.currentFilter = filter;
        this.offset = 0;
        this.pokemons = [];
        this.errorMessage = '';
        this.loadPokemons();
      }
    });

    this.loadPokemons();

    this.favoritesSub = this.favoritesService.favorites$.subscribe(ids => {
      this.favoriteIds = ids;
    });
  }

  ngOnDestroy() {
    this.favoritesSub?.unsubscribe();
    this.filterSub?.unsubscribe();
  }

  loadPokemons(event?: any) {
    if (this.isFetching) return;

    this.isFetching = true;
    if (!event) this.isLoading = true;
    this.errorMessage = '';

    this.pokemonService
      .getPokemons(this.limit, this.offset, '') // Aqui passa '' pois filtro está no serviço
      .subscribe({
        next: ({ pokemons, total }) => {
          if (this.offset === 0) {
            this.pokemons = pokemons;
          } else {
            this.pokemons = [...this.pokemons, ...pokemons];
          }
          this.total = total;
          this.offset += this.limit;
          this.isLoading = false;
          this.isFetching = false;
          if (event) event.target.complete();
        },
        error: () => {
          this.errorMessage =
            'Não foi possível carregar os Pokémon. Verifique sua conexão e tente novamente.';
          this.isLoading = false;
          this.isFetching = false;
          if (event) event.target.complete();
        },
      });
  }

  retry() {
    this.offset = 0;
    this.pokemons = [];
    this.errorMessage = '';
    this.loadPokemons();
  }

  canLoadMore(): boolean {
    return this.offset < this.total;
  }

  openDetails(pokemon: Pokemon) {
    this.navCtrl.navigateForward(`/details/${pokemon.id}`);
  }

  async toggleFavorite(pokemon: Pokemon) {
    await this.favoritesService.toggleFavorite(+pokemon.id);
  }

  isFavorite(pokemon: Pokemon): boolean {
    return this.favoriteIds.includes(+pokemon.id);
  }

  applyFilter(filter: string | null) {
    this.filterService.setFilter(filter);
  }
}
