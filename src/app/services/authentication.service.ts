import { Injectable } from '@angular/core';
import { UserAuth } from '../classes/user-auth';
import { UserLogin } from '../classes/user-login';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WatchlistService } from 'src/app/services/watchlist.service';

const CREDENTIALS: UserLogin[] = [
  {
    userName: 'Anna',
    password: 'annapwd'
  },
  {
    userName: 'Botond',
    password: 'botondpwd'
  }
]

const USERS: UserAuth[] = [
  {
    userName: 'Anna',
    isAuthenticated: true
  },
  {
    userName: 'Botond',
    isAuthenticated: true
  }
]

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  activeUserWatchlistSubscription: Subscription;
  activeUser: UserAuth;
  activeUserSubject: BehaviorSubject<UserAuth>;

  constructor(
    private router: Router,
    private watchListService: WatchlistService
  ) {
    if (environment.fakeLogin) {
      this.activeUser = USERS[0];
      this.activeUser.watchList = this.watchListService.getWatchlistForUser(this.activeUser.userName);
    } else {
      this.resetActiveUser();
    }
    console.log(this.activeUser);
    this.activeUserSubject = new BehaviorSubject(this.activeUser);
    this.activeUserWatchlistSubscription = this.watchListService.userWatchlistSubject.subscribe(userWatchlist => {
      let newActiveUser: UserAuth = Object.assign({}, this.activeUser)
      newActiveUser.watchList = userWatchlist;
      this.activeUser = newActiveUser;
      this.activeUserSubject.next(this.activeUser);
    });
  }

  resetActiveUser() {
    this.activeUser = {
      userName: '',
      isAuthenticated: false
    };
  }

  getActiveUser() {
    return this.activeUser;
  }

  login(user: UserLogin): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let userFound: UserLogin = CREDENTIALS.find(u => { return u.userName === user.userName && u.password === user.password });
      if (userFound) {
        let userData: UserAuth = USERS.find(u => { return u.userName === userFound.userName });
        userData.watchList = this.watchListService.getWatchlistForUser(userData.userName);
        this.activeUser = userData;
        this.activeUserSubject.next(this.activeUser);
        resolve(true);
      } else {
        resolve(false);
      }
    })
  }

  logout(): void {
    this.resetActiveUser();
    this.activeUserSubject.next(this.activeUser);
    this.router.navigate(['/login']);
  }
}
