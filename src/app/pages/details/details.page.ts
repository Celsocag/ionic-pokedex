import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../../services/pokemon.service';
import { FavoritesService } from '../../../services/favorites.service';
import { Subscription } from 'rxjs';

import 'swiper/element/bundle';
import type { SwiperContainer } from 'swiper/element';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false
})
export class DetailsPage implements OnInit, OnDestroy, AfterViewInit {
  pokemon: any;
  isLoading = true;
  favoriteIds: number[] = [];
  private favoritesSub?: Subscription;

  types: string[] = [];
  abilities: string[] = [];
  stats: { name: string; value: number }[] = [];
  imageUrl: string = '';
  images: string[] = [];

  // Novos campos
  description: string = '';
  habitat: string = '';
  generation: string = '';

  @ViewChild('pokemonImagesSwiper', { static: false })
  swiperRef?: ElementRef<SwiperContainer>;

  private swiperInstance?: SwiperContainer['swiper'];

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPokemonDetails(id);

    this.favoritesSub = this.favoritesService.favorites$.subscribe(favs => {
      this.favoriteIds = favs;
    });
  }

  ngAfterViewInit() {
    if (this.swiperRef?.nativeElement) {
      const swiperEl = this.swiperRef.nativeElement;

      swiperEl.addEventListener('swiperinit', () => {
        this.swiperInstance = swiperEl.swiper;
        this.swiperInstance?.on('slideChange', () => {});
      });
    }
  }

  ngOnDestroy() {
    this.favoritesSub?.unsubscribe();
  }

  loadPokemonDetails(id: number) {
    this.isLoading = true;
    this.pokemonService.getPokemonDetails(id).subscribe({
      next: (data: any) => {
        this.pokemon = data;
        this.imageUrl = data.imageUrl || '';
        this.types = data.types || [];
        this.abilities = data.abilities || [];
        this.stats = data.stats || [];
        const imgs: string[] = Array.isArray(data.images) ? data.images : [];
        this.images = [this.imageUrl, ...imgs.filter((img: string) => img !== this.imageUrl).slice(0, 4)];

        // Atualiza os novos campos
        this.description = data.description || '';
        this.habitat = data.habitat || '';
        this.generation = data.generation || '';

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

  goToNextSlide() {
    this.swiperInstance?.slideNext();
  }

  goToPrevSlide() {
    this.swiperInstance?.slidePrev();
  }
}
