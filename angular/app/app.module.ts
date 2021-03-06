import { NgModule }      from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { AppComponent }  from './app.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { WebSocketService } from './notifications/websocket.service';
import { NotificationModule } from './notifications/notifications.module';

import { ChatComponent } from './chat.component';

import { GameChatComponent } from './gameCards/gameChat.component';
import { GameHistoryComponent } from './gameCards/gameHistory.component';

import { MenuComponent } from './menu/menu.component';
import { DashboardComponent } from './menu/dashboard.component';
import { HomeComponent } from './menu/home.component';
import { Top10StarComponent } from './menu/top10Star.component';
import { Top10PointComponent } from './menu/top10Point.component';

import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { ProfileComponent } from './auth/profile.component';

import { UserService } from './auth/user.service';
import { ValidatorService } from './auth/validator.service';
import { GameService } from './gameCards/game.service';

import { GameLobbyComponent } from './gameCards/gameLobby.component';
import { NewGameComponent } from './gameCards/newGame.component';
import { GameSearchComponent } from './gameCards/gameSearch.component';
import { GameComponent } from './gameCards/game.component';
import { Routing } from './app.routing';

@NgModule({
  imports: [ BrowserModule, 
             NotificationModule, 
             FormsModule,
             ReactiveFormsModule,
             Routing
  ],
  declarations: [ AppComponent, 
                  HomeComponent, 
                  Top10StarComponent, 
                  Top10PointComponent, 
                  GameSearchComponent, 
                  NewGameComponent, 
                  GameComponent,
                  GameLobbyComponent,
                  GameHistoryComponent, 
                  LoginComponent, 
                  RegisterComponent,
                  ProfileComponent, 
                  MenuComponent, 
                  ChatComponent,
                  GameChatComponent, 
                  DashboardComponent
  ],
  providers:    [ WebSocketService, UserService, ValidatorService, GameService],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }