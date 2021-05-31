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

  userName = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  wrongCredentials: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  resetLogin(): void {
    this.userName.setValue('');
    this.password.setValue('');
    this.userNameInput.nativeElement.focus();
  }

  onUserNameChange() {
    if (this.userName.value.length) {
      this.passwordInput.nativeElement.focus();
    }
  }
  
  onPasswordChange() {
    if (this.password.value.length) {
      this.onSubmitLogin();
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
