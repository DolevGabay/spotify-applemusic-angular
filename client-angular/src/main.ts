import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { AppComponent } from './app/app.component';
import { appReducer } from './app/store/app.reducer';

bootstrapApplication(AppComponent, {
  providers: [
    provideStore({ app: appReducer }), // Register the unified reducer
  ]
}).catch(err => console.error(err));
