import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service'
import { UserAuth } from './classes/user-auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  user: UserAuth

  constructor(
    private authenticationService: AuthenticationService
  ) {}

  onLogoutClick(): void {
    this.authenticationService.logout();
  }

  ngOnInit(): void {
    this.authenticationService.activeUserSubject.subscribe(user => {
      this.user = user;
    })
  }
}
