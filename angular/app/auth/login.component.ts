import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidatorService } from './validator.service';
import { User } from './user';

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  public myForm: FormGroup; // our model driven form
  public submitted: boolean; // keep track on whether form is submitted

  constructor( public fb: FormBuilder ,private userService: UserService, private router: Router) { }

  ngOnInit() {
    // we will initialize our form model here
    this.myForm = this.fb.group({
      username: ['', [<any>Validators.required]],
      password: ['', [<any>Validators.required]],
    });
  }

  save(model: User, isValid: boolean) {
    this.submitted = true; // set form submit to true
    if(isValid){
      this.userService.login(model.username, model.password);
    }
  }

  
}
