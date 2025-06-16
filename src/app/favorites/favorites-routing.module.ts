import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { FavoritesPage } from './favorites.page';
import { PokemonCardComponent } from 'src/app/components/pokemon-card/pokemon-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PokemonCardComponent,
  ]
})
export class FavoritesPageModule {}
