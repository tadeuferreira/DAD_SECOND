import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { NotificationComponent }  from './notification.component';

@NgModule({
  imports:      [ BrowserModule, HttpModule ],
  declarations: [ NotificationComponent ],
  exports:      [ NotificationComponent]
})
export class NotificationModule { }
