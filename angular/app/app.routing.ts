import { Routes, RouterModule } from '@angular/router';

import { AppComponent }  from './app.component';
import { MenuComponent } from './menu/menu.component';
import { DashboardComponent } from './menu/dashboard.component';
import { HomeComponent } from './menu/home.component';
import { Top10StarComponent } from './menu/top10Star.component';
import { Top10PointComponent } from './menu/top10Point.component';

import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { ProfileComponent } from './auth/profile.component';

import { GameLobbyComponent } from './gameCards/gameLobby.component';
import { NewGameComponent } from './gameCards/newGame.component';
import { GameSearchComponent } from './gameCards/gameSearch.component';
import { GameComponent } from './gameCards/game.component';
import { GameHistoryComponent } from './gameCards/gameHistory.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
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
        path: 'game/new',
        component: NewGameComponent
    },
    {
        path: 'game/play',
        component: GameLobbyComponent
    },
    {
        path: 'games',
        component: GameSearchComponent
    },
    {
        path: 'top10Stars',
        component: Top10StarComponent
    },
    {
        path: 'top10Points',
        component: Top10PointComponent
    },
    {
        path: 'gamesHistory',
        component: GameHistoryComponent
    },
    {
        path: 'game/playing',
        component: GameComponent
    },
    {
        path: 'home',
        component: HomeComponent
    }
];

export const Routing = RouterModule.forRoot(appRoutes);