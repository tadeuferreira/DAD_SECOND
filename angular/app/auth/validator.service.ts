import { FormControl, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class ValidatorService {

    constructor() { }

    emailValidator(control: FormControl): { [key: string]: any } {
        var emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        if (control.value && !emailRegexp.test(control.value)) {
            return {
                invalidEmail: true
            };
        }
    }

    matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
        return (group: FormGroup): { [key: string]: any } => {
            let password = group.controls[passwordKey];
            let confirmPassword = group.controls[confirmPasswordKey];

            if (password.value !== confirmPassword.value) {
                return {
                    mismatchedPasswords: true
                };
            }
        }
    }
}