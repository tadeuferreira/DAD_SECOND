import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { UserService } from '../auth/user.service';

@Component({
    moduleId: module.id,
    selector: 'menu',
    templateUrl: 'menu.component.html',
})

export class MenuComponent implements OnInit {

    @Input() hidden: boolean;

    constructor(private userService: UserService) { }

    ngOnInit() {
    }

    isLoggedIn() {
        return this.userService.isLoggedIn();
    }
}