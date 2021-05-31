import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service'
import { UserAuth } from './classes/user-auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  user: UserAuth;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  onNavigateToWatchlistClick() {
    this.router.navigate(['/watchlist']);
  }

  onLogoutClick(): void {
    this.authenticationService.logout();
  }

  ngOnInit(): void {
    const path = localStorage.getItem('path');
    if (path) {
      localStorage.removeItem('path');
      this.router.navigate([path]);
    }
    this.authenticationService.activeUserSubject.subscribe(user => {
      console.log(user)
      this.user = user;
    })
  }
}
