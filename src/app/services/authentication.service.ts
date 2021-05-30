import { Injectable } from '@angular/core';
import { UserAuth } from '../classes/user-auth';
import { UserLogin } from '../classes/user-login';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs'

const USERS: UserLogin[] = [
  {
    userName: 'Anna',
    password: 'annapwd'
  },
  {
    userName: 'Botond',
    password: 'botondpwd'
  }
]

const CREDENTIALS: UserAuth[] = [
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

  activeUser: UserAuth;
  activeUserSubject: BehaviorSubject<UserAuth>;

  constructor(
    private router: Router
  ) {
    this.resetActiveUser();
    this.activeUserSubject = new BehaviorSubject(this.activeUser)
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
      let userFound: UserLogin = USERS.find(u => { return u.userName === user.userName && u.password === user.password });
      if (userFound) {
        const userData: UserAuth = CREDENTIALS.find(u => { return u.userName === userFound.userName })
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
