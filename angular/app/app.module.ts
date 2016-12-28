import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { AppComponent }  from './app.component';
import { RouterModule } from '@angular/router';

import { NotificationModule } from './notifications/notifications.module';
import { ChatComponent } from './chat.component';
import { ABoardComponent } from './game/aboard.component';
import { DBoardComponent } from './game/dboard.component';
import { WebSocketService } from './notifications/websocket.service';
import { MenuComponent } from './menu/menu.component';
import { DashboardComponent } from './menu/dashboard.component';

@NgModule({
  imports:      [ 
  BrowserModule, 
  NotificationModule, 
  FormsModule,
  RouterModule.forRoot([
  	{
  path: '',
  redirectTo: '/dashboard',
  pathMatch: 'full'
},
  {
    path: 'menu',
    component: MenuComponent
  },
  {
 	path: 'dashboard',
  component: DashboardComponent
  }
])
  ],
  declarations: [ AppComponent, MenuComponent,ChatComponent, ABoardComponent, DBoardComponent, DashboardComponent ],
  providers:    [ WebSocketService ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
