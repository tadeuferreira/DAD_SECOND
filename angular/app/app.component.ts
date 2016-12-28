import { Component } from '@angular/core';
import { MenuComponent} from './menu/menu.component';

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'app.component.html',
})
export class AppComponent { 
	public onMenu: boolean = true;
	public onCreateGame: boolean = false;

	public switchMenu(){
		this.onMenu = !this.onMenu;
	}

}
