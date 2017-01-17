import { Component, Input, OnInit } from '@angular/core';
import {AppComponent} from '../app.component';



@Component({
    moduleId: module.id,
    selector: 'menu',
    templateUrl: 'menu.component.html',
})

export class MenuComponent implements OnInit{

	@Input() hidden:boolean;
    
    ngOnInit() {
    }
}