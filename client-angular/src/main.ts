import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideStore, ActionReducer, MetaReducer } from '@ngrx/store';
import { AppComponent } from './app/app.component';
import { appReducer } from './app/store/app.reducer';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { localStorageSync } from 'ngrx-store-localstorage';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({ keys: ['app'], rehydrate: true })(reducer);
}

const metaReducers: MetaReducer<any>[] = [localStorageSyncReducer];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideStore(
      { app: appReducer }, 
      { metaReducers }     
    ),
    importProvidersFrom(HttpClientModule),
  ],
}).catch((err) => console.error(err));
