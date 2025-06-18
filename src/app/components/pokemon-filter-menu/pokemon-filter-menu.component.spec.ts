import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PokemonFilterMenuComponent } from './pokemon-filter-menu.component';

describe('PokemonFilterMenuComponent', () => {
  let component: PokemonFilterMenuComponent;
  let fixture: ComponentFixture<PokemonFilterMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), PokemonFilterMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonFilterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
