import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @ViewChild('passwordInputRef') passwordInput: ElementRef;
  @ViewChild('userNameInputRef') userNameInput: ElementRef;
  @ViewChild('submitLoginRef') submitLogin: HTMLButtonElement;

  userName: string = '';
  password: string = '';

  wrongCredentials: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  resetLogin(): void {
    this.userName = '';
    this.password = '';
    this.userNameInput.nativeElement.focus();
  }

  onUserNameChange() {
    if (this.userName.length) {
      this.passwordInput.nativeElement.focus();
    }
  }
  
  onPasswordChange() {
    if (this.password.length) {
      this.submitLogin.focus();
    }
  }

  onSubmitLogin() {
    this.authenticationService.login({ userName: this.userName, password: this.password })
      .then(result => {
        if (result) {
          this.router.navigate(['/movies']);
        } else {
          this.wrongCredentials = true;
          this.resetLogin();
        }
      });    
  }

  ngAfterViewInit() {
    this.userNameInput.nativeElement.focus();
  }

}
