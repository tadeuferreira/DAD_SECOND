import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidatorService } from './validator.service';
import { User } from './user';

@Component({
  moduleId: module.id,
  selector: 'Register',
  templateUrl: 'Register.component.html',
})
export class RegisterComponent implements OnInit {
  public myForm: FormGroup; // our model driven form
  public submitted: boolean; // keep track on whether form is submitted
  
  constructor(public fb: FormBuilder, private userService: UserService, private validateService: ValidatorService, private router: Router) { }

  ngOnInit() {
    // we will initialize our form model here
    this.myForm = this.fb.group({
      username: ['', [<any>Validators.required]],
      name: ['', [<any>Validators.required]],
      email: ['', [<any>Validators.compose([Validators.required, this.validateService.emailValidator])]],
      password: ['', [<any>Validators.required]],
      passwordConfirmation: ['', [<any>Validators.required]],
    }, { validator: this.validateService.matchingPasswords('password', 'passwordConfirmation') });
  }

  save(model: User, isValid: boolean) {
    this.submitted = true; // set form submit to true
    if (isValid) {
      this.userService.register(model.username, model.name, model.email, model.password);
    }
  }
}
