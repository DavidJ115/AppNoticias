import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, Routes } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';


import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

//Plugin para enlaces web
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

import { defineCustomElements } from 'ionicons/dist/loader';
import { provideStorage } from '@ionic/storage-angular';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

const routes2: Routes = [
  {
    path:'',
    loadChildren: () => import('./app/pages/tabs/tabs.page').then(m => m.TabsPage)
  }
]

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    InAppBrowser, provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
    

  ]
});

defineCustomElements(window);