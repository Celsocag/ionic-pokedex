import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PokemonService } from '../../../services/pokemon.service';
import { Pokemon } from '../../../models/pokemon.model';
import { NavController } from '@ionic/angular';
import { FavoritesService } from '../../../services/favorites.service';
import { Subscription } from 'rxjs';
import { PokemonCardComponent } from 'src/app/components/pokemon-card/pokemon-card.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonFilterMenuComponent } from 'src/app/components/pokemon-filter-menu/pokemon-filter-menu.component';
import { FilterService } from '../../../services/filter.service';

/**
 * Página inicial da Pokédex.
 * Exibe a lista de Pokémons, permite filtrar por tipo, favoritar e navegar para detalhes.
 */
@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    PokemonCardComponent,
    PokemonFilterMenuComponent,
    IonicModule,
    CommonModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

  showRotateBanner = false;

  private readonly STORAGE_KEY_BANNER_SHOWN = 'rotateBannerShown';

  skeletons = Array(8);

  private onResize = () => {
    this.checkOrientation();
  };

  constructor(
    private pokemonService: PokemonService,
    private navCtrl: NavController,
    private favoritesService: FavoritesService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.checkOrientation();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onResize);
    }

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

    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize);
    }
  }

  /**
   * Exibe um banner sugerindo girar o dispositivo caso esteja em modo retrato.
   * O banner só aparece uma vez por sessão.
   */
  private checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const bannerAlreadyShown = localStorage.getItem(this.STORAGE_KEY_BANNER_SHOWN) === 'true';

    this.showRotateBanner = isPortrait && !bannerAlreadyShown;
  }

  closeRotateBanner() {
    this.showRotateBanner = false;
    localStorage.setItem(this.STORAGE_KEY_BANNER_SHOWN, 'true');
  }

  loadPokemons(event?: any) {
    if (this.isFetching) return;

    this.isFetching = true;
    if (!event) this.isLoading = true;
    this.errorMessage = '';

    this.pokemonService
      .getPokemons(this.limit, this.offset, '')
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

  trackByPokemonId(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }

  trackBySkeleton(index: number, item: any): number {
    return index;
  }

  applyFilter(filter: string | null) {
    this.filterService.setFilter(filter);
  }
}
