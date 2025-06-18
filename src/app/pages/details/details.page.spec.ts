import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicStorageModule } from '@ionic/storage-angular';
import { DetailsPage } from './details.page';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { Pokemon } from 'src/models/pokemon.model';
import { PokemonService } from 'src/services/pokemon.service';
import { FavoritesService } from 'src/services/favorites.service';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const mockPokemon = new Pokemon('bulbasaur', 'url', 1, 'img1', ['grass'], ['overgrow'], [{ name: 'hp', value: 45 }], ['img1', 'img2'], 'desc', 'forest', 'gen1');

describe('DetailsPage', () => {
  let component: DetailsPage;
  let fixture: ComponentFixture<DetailsPage>;
  let pokemonService: any;
  let favoritesService: any;
  let route: any;

  beforeEach(() => {
    pokemonService = {
      getPokemonDetails: jasmine.createSpy().and.returnValue(of(mockPokemon)),
    };
    favoritesService = {
      favorites$: new BehaviorSubject<number[]>([1]),
      toggleFavorite: jasmine.createSpy().and.returnValue(Promise.resolve()),
    };
    route = { snapshot: { paramMap: { get: () => '1' } } };

    TestBed.configureTestingModule({
      declarations: [DetailsPage],
      imports: [HttpClientTestingModule, IonicModule.forRoot(), RouterTestingModule, IonicStorageModule.forRoot()],
      providers: [
        { provide: PokemonService, useValue: pokemonService },
        { provide: FavoritesService, useValue: favoritesService },
        { provide: ActivatedRoute, useValue: route },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(DetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pokemon details successfully', () => {
    component.loadPokemonDetails(1);
    expect(pokemonService.getPokemonDetails).toHaveBeenCalledWith(1);
    expect(component.pokemon).toEqual(mockPokemon);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when loading pokemon details', fakeAsync(() => {
    spyOn(console, 'error');
    pokemonService.getPokemonDetails.and.returnValue(throwError(() => new Error('fail')));
    component.loadPokemonDetails(1);
    tick();
    expect(component.isLoading).toBeFalse();
  }));

  it('should return true if pokemon is favorite', () => {
    component.favoriteIds = [1];
    expect(component.isFavorite(mockPokemon)).toBeTrue();
  });

  it('should return false if pokemon is not favorite', () => {
    component.favoriteIds = [2];
    expect(component.isFavorite(mockPokemon)).toBeFalse();
  });

  it('should call toggleFavorite on service', async () => {
    await component.toggleFavorite(mockPokemon);
    expect(favoritesService.toggleFavorite).toHaveBeenCalledWith(Number(mockPokemon.id));
  });

  it('should not call toggleFavorite if pokemon is null', async () => {
    await component.toggleFavorite(null);
    expect(favoritesService.toggleFavorite).not.toHaveBeenCalled();
  });

  it('should call slideNext and slidePrev on swiperInstance', () => {
    component['swiperInstance'] = { slideNext: jasmine.createSpy(), slidePrev: jasmine.createSpy() } as any;
    if (component['swiperInstance']) {
      component.goToNextSlide();
      expect(component['swiperInstance'].slideNext).toHaveBeenCalled();
      component.goToPrevSlide();
      expect(component['swiperInstance'].slidePrev).toHaveBeenCalled();
    }
  });

  it('should unsubscribe on destroy', () => {
    const spy = spyOn(component['favoritesSub']!, 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
