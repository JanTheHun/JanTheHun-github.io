import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @ViewChild('passwordInputRef') passwordInput: ElementRef;
  @ViewChild('userNameInputRef') userNameInput: ElementRef;
  @ViewChild('submitLoginRef') submitLogin: HTMLButtonElement;

  userName = new FormControl('', [Validators.required, Validators.minLength(3)]);
  password = new FormControl('', [Validators.required, Validators.minLength(3)]);
  wrongCredentials: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  resetLogin(): void {
    this.userNameInput.nativeElement.focus();
    this.userName.reset();
    this.password.reset();
  }

  onUserNameChange() {
    if (this.userName.valid) {
      this.passwordInput.nativeElement.focus();
    }
  }
  
  onPasswordChange() {
    if (this.password.valid) {
      this.submitLogin.focus();
    }
  }

  onSubmitLogin() {
    if (!this.userName.hasError('required') && !this.password.hasError('required')) {
      this.authenticationService.login({ userName: this.userName.value, password: this.password.value })
        .then(result => {
          if (result) {
            this.router.navigate(['/movies']);
          } else {
            this.wrongCredentials = true;
            this.resetLogin();
          }
        });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.userNameInput.nativeElement.focus();
    }, 0)
  }

}
