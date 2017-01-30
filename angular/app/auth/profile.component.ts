import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidatorService } from './validator.service';
import { User } from './user';

@Component({
    moduleId: module.id,
    selector: 'profile',
    templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {
    public myForm: FormGroup; // our model driven form
    public submitted: boolean; // keep track on whether form is submitted

    public userProfile: any;

    public isLoading: boolean = true;

    constructor(public fb: FormBuilder, private userService: UserService, private validateService: ValidatorService, private router: Router) { }

    ngOnInit() {
        this.userService.getProfile()
            .subscribe(response => {
                this.userProfile = response.json();
                this.isLoading = false;
                console.log(this.userProfile.avatar);
            });

        this.myForm = this.fb.group({
            avatar: [''],
            username: ['', [<any>Validators.required]],
            name: ['', [<any>Validators.required]],
            email: ['', [<any>Validators.compose([Validators.required, this.validateService.emailValidator])]],
            password: ['', [<any>Validators.required]],
            passwordConfirmation: ['', [<any>Validators.required]],
        }, { validator: this.validateService.matchingPasswords('password', 'passwordConfirmation') });
    }

    edit(user: User) {
        user.avatar = this.userProfile.avatar;
        this.submitted = true;
        this.userService.update(user);
        console.log(user);
    }

    changeAvatar() {
        this.userProfile.avatar = 'https://api.adorable.io/avatars/285/' + Math.random().toString(36).substr(2, 5) + '.png';
    }
}