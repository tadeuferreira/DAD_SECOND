import { NgModule }      from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { AppComponent }  from './app.component';
import { RouterModule } from '@angular/router';

import { WebSocketService } from './notifications/websocket.service';
import { NotificationModule } from './notifications/notifications.module';

import { ChatComponent } from './chat.component';

import { ABoardComponent } from './game/aboard.component';
import { DBoardComponent } from './game/dboard.component';

import { MenuComponent } from './menu/menu.component';
import { DashboardComponent } from './menu/dashboard.component';

import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { UserService } from './auth/user.service';



@NgModule({
  imports:      [ 
  BrowserModule, 
  NotificationModule, 
  FormsModule,
  ReactiveFormsModule,
  RouterModule.forRoot([
  	{
  path: '',
  redirectTo: '/dashboard',
  pathMatch: 'full'
	},
  {
 	path: 'dashboard',
  component: DashboardComponent
  },
  {
 	path: 'login',
  component: LoginComponent
  },
  {
   path: 'register',
  component: RegisterComponent
  }
])
  ],
  declarations: [ AppComponent, LoginComponent,RegisterComponent, MenuComponent,ChatComponent, ABoardComponent, DBoardComponent, DashboardComponent ],
  providers:    [ WebSocketService, UserService ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
