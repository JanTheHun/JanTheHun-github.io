import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @ViewChild('passwordInputRef') passwordInput: ElementRef;
  @ViewChild('passwordAgainInputRef') passwordAgainInput: ElementRef;
  @ViewChild('userNameInputRef') userNameInput: ElementRef;
  @ViewChild('submitRegistrationRef') submitRegistration: HTMLButtonElement;


  userName = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  passwordAgain = new FormControl('', [Validators.required]);

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  checkPasswords(): any {
    const password = this.password.value;
    const confirmPassword = this.passwordAgain.value;  
    if (password !== confirmPassword) {
      this.passwordAgain.setErrors({ notSame: true })
    }
  }

  onUserNameChange(): void {
    if (this.userName.value.length) {
      this.passwordInput.nativeElement.focus();
    }
  }
  
  onPasswordChange(): void {
    this.checkPasswords();
    if (this.password.value.length) {
      this.passwordAgainInput.nativeElement.focus();
    }
  }
  
  onPasswordAgainChange(): void {
    this.checkPasswords();
    if (this.passwordAgain.value.length) {
      this.onSubmitRegistration();
    }
  }

  onSubmitRegistration(): void {
    if (!this.userName.hasError('required') && !this.password.hasError('required')) {
      this.authenticationService.register({ userName: this.userName.value, password: this.password.value })
        .then(result => {
          if (result) {
            console.log('success registering new user')
          } else {
            console.log('existing user')
          }
        });
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.userNameInput.nativeElement.focus();
    }, 0)
  }

}
