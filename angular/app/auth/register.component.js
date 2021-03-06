"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var user_service_1 = require("./user.service");
var forms_1 = require("@angular/forms");
var validator_service_1 = require("./validator.service");
var RegisterComponent = (function () {
    function RegisterComponent(fb, userService, validateService, router) {
        this.fb = fb;
        this.userService = userService;
        this.validateService = validateService;
        this.router = router;
    }
    RegisterComponent.prototype.ngOnInit = function () {
        // we will initialize our form model here
        this.myForm = this.fb.group({
            username: ['', [forms_1.Validators.required]],
            name: ['', [forms_1.Validators.required]],
            email: ['', [forms_1.Validators.compose([forms_1.Validators.required, this.validateService.emailValidator])]],
            password: ['', [forms_1.Validators.required]],
            passwordConfirmation: ['', [forms_1.Validators.required]],
        }, { validator: this.validateService.matchingPasswords('password', 'passwordConfirmation') });
    };
    RegisterComponent.prototype.save = function (model, isValid) {
        this.submitted = true; // set form submit to true
        if (isValid) {
            this.userService.register(model.username, model.name, model.email, model.password);
        }
    };
    return RegisterComponent;
}());
RegisterComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'Register',
        templateUrl: 'register.component.html',
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder, user_service_1.UserService, validator_service_1.ValidatorService, router_1.Router])
], RegisterComponent);
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map