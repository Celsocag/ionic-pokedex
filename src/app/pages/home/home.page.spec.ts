import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HomePage } from './home.page';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { Pokemon } from 'src/models/pokemon.model';
import { PokemonService } from 'src/services/pokemon.service';
import { FavoritesService } from 'src/services/favorites.service';
import { FilterService } from 'src/services/filter.service';

const mockPokemons = [
  new Pokemon('bulbasaur', 'url', 1, 'img1'),
  new Pokemon('ivysaur', 'url', 2, 'img2'),
];

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let pokemonService: any;
  let navCtrl: any;
  let favoritesService: any;
  let filterService: any;

  beforeEach(() => {
    pokemonService = {
      getPokemons: jasmine.createSpy().and.returnValue(of({ pokemons: mockPokemons, total: 2 }))
    };
    navCtrl = { navigateForward: jasmine.createSpy() };
    favoritesService = {
      favorites$: of([1]),
      toggleFavorite: jasmine.createSpy().and.returnValue(Promise.resolve()),
    };
    filterService = {
      filter$: new BehaviorSubject<string|null>(null),
      setFilter: jasmine.createSpy(),
    };

    TestBed.configureTestingModule({
      imports: [HomePage, HttpClientTestingModule, IonicModule.forRoot(), IonicStorageModule.forRoot()],
      providers: [
        { provide: PokemonService, useValue: pokemonService },
        { provide: NavController, useValue: navCtrl },
        { provide: FavoritesService, useValue: favoritesService },
        { provide: FilterService, useValue: filterService },
      ]
    });
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    spyOn(component, 'loadPokemons').and.callFake(() => {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pokemons successfully', () => {
    (component.loadPokemons as any).and.callThrough();
    component.loadPokemons();
    expect(pokemonService.getPokemons).toHaveBeenCalled();
    expect(component.pokemons.length).toBe(2);
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('');
  });

  it('should handle error when loading pokemons', () => {
    (component.loadPokemons as any).and.callThrough();
    pokemonService.getPokemons.and.returnValue(throwError(() => new Error('fail')));
    component.loadPokemons();
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toContain('Não foi possível carregar');
  });

  it('should retry and reload pokemons', () => {
    (component.loadPokemons as any).and.callThrough();
    component.pokemons = [];
    component.offset = 10;
    component.errorMessage = 'erro';
    component.retry();
    expect(component.offset).toBe(component.limit);
    expect(component.errorMessage).toBe('');
    expect(pokemonService.getPokemons).toHaveBeenCalled();
  });

  it('should return true for canLoadMore if offset < total', () => {
    component.offset = 0;
    component.total = 10;
    expect(component.canLoadMore()).toBeTrue();
  });

  it('should return false for canLoadMore if offset >= total', () => {
    component.offset = 10;
    component.total = 10;
    expect(component.canLoadMore()).toBeFalse();
  });

  it('should navigate to details', () => {
    component.openDetails(mockPokemons[0]);
    expect(navCtrl.navigateForward).toHaveBeenCalledWith('/details/1');
  });

  it('should call toggleFavorite on service', async () => {
    await component.toggleFavorite(mockPokemons[0]);
    expect(favoritesService.toggleFavorite).toHaveBeenCalledWith(1);
  });

  it('should return true if pokemon is favorite', () => {
    component.favoriteIds = [1];
    expect(component.isFavorite(mockPokemons[0])).toBeTrue();
  });

  it('should return false if pokemon is not favorite', () => {
    component.favoriteIds = [2];
    expect(component.isFavorite(mockPokemons[0])).toBeFalse();
  });

  it('should track by pokemon id', () => {
    expect(component.trackByPokemonId(0, mockPokemons[0])).toBe(1);
  });

  it('should apply filter', () => {
    component.applyFilter('grass');
    expect(filterService.setFilter).toHaveBeenCalledWith('grass');
  });
});
