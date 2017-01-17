import { Component } from '@angular/core';
import { MenuComponent} from './menu/menu.component';
import { UserService } from './auth/user.service';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'app.component.html',
})
export class AppComponent { 
	public onMenu: boolean = true;
	public onCreateGame: boolean = false;
	
	constructor(private userService: UserService, private router: Router) {}

    isLoggedIn(){
        return this.userService.isLoggedIn();
    }
    logout(){
    	this.userService.logout();
    	return this.router.navigate(['login']);
    }
	public switchMenu(){
		this.onMenu = !this.onMenu;
	}

	getUsername(){
		return sessionStorage.getItem('username');
	}
	getAvatar(){
		return sessionStorage.getItem('avatar');
	}

}
