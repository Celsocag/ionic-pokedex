import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// main.ts
import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';

// Importar e registrar os componentes do Swiper
import { register } from 'swiper/element/bundle';



import { AppModule } from './app/app.module';
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));



platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

// Chamar register para registrar os web components do Swiper
register();
