import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';

import { register } from 'swiper/element/bundle';



import { AppModule } from './app/app.module';
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));



platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

register();
