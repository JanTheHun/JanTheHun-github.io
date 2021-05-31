import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MoviesComponent } from './components/movies/movies.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from 'src/app/guards/auth.guard'
import { DetailsComponent } from './components/details/details.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {
    path: 'movies',
    component: MoviesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'watchlist',
    component: WatchlistComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '**',
    redirectTo: '/movies', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
