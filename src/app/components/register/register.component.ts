import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  userName = new FormControl('', [Validators.required, Validators.minLength(3)]);
  password = new FormControl('', [Validators.required, Validators.minLength(3)]);
  passwordAgain = new FormControl('', [Validators.required, Validators.minLength(3)]);
  wrongUsername: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  resetForm(): void {
    this.userNameInput.nativeElement.focus();
    this.userName.reset();
    this.password.reset();
    this.passwordAgain.reset();
  }

  checkPasswords(): any {
    const password = this.password.value;
    const confirmPassword = this.passwordAgain.value;  
    if (password !== confirmPassword) {
      this.passwordAgain.setErrors({ notSame: true })
    }
  }

  onUserNameChange(): void {
    if (this.userName.valid) {
      this.passwordInput.nativeElement.focus();
    }
  }
  
  onPasswordChange(): void {
    this.checkPasswords();
    if (this.password.valid) {
      this.passwordAgainInput.nativeElement.focus();
    }
  }
  
  onPasswordAgainChange(): void {
    this.checkPasswords();
    if (this.passwordAgain.valid) {
      this.submitRegistration.focus();
    }
  }

  onSubmitRegistration(): void {
    if (!this.userName.hasError('required') && !this.password.hasError('required')) {
      this.authenticationService.register({ userName: this.userName.value, password: this.password.value })
        .then(result => {
          if (result) {
            this.router.navigate(['/login']);
          } else {
            this.wrongUsername = true;
            this.resetForm();
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
