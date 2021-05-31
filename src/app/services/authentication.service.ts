import { Injectable } from '@angular/core';
import { UserAuth } from '../classes/user-auth';
import { UserLogin } from '../classes/user-login';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WatchlistService } from 'src/app/services/watchlist.service';

const CREDENTIALS: UserLogin[] = [
  {
    userName: 'Alice',
    password: 'alicepwd'
  },
  {
    userName: 'Bob',
    password: 'bobpwd'
  }
]

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userList: UserLogin[]
  activeUserWatchlistSubscription: Subscription;
  activeUser: UserAuth;
  activeUserSubject: BehaviorSubject<UserAuth>;

  constructor(
    private router: Router,
    private watchListService: WatchlistService
  ) {
    let usersInLocalStorage: UserLogin[] = this.getUsersFromStorage();
    this.userList = CREDENTIALS.concat(usersInLocalStorage);
    if (environment.fakeLogin) {
      this.activeUser = {
        userName: this.userList[0].userName,
        isAuthenticated: true
      };
      this.activeUser.watchList = this.watchListService.getWatchlistForUser(this.activeUser.userName);
    } else {
      this.resetActiveUser();
    }
    this.activeUserSubject = new BehaviorSubject(this.activeUser);
    this.activeUserWatchlistSubscription = this.watchListService.userWatchlistSubject.subscribe(userWatchlist => {
      let newActiveUser: UserAuth = Object.assign({}, this.activeUser)
      newActiveUser.watchList = userWatchlist;
      this.activeUser = newActiveUser;
      this.activeUserSubject.next(this.activeUser);
    });
  }

  getUsersFromStorage(): UserLogin[] {
    let usersInStorage: UserLogin[] = []
    let users: any = JSON.parse(localStorage.getItem('users'));
    if (users && Object.prototype.toString.call(users) === '[object Array]') {
      usersInStorage = users;
    }
    return usersInStorage;
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

  register(user: UserLogin): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let userFound: UserLogin = this.userList.find(u => { return u.userName === user.userName });
      if (!userFound) {
        
        let usersInStorage: UserLogin[] = JSON.parse(localStorage.getItem('users')) || [];
        usersInStorage.push(user);
        localStorage.setItem('users', JSON.stringify(usersInStorage));
        let newUserList: UserLogin[] = Object.assign([], this.userList);
        newUserList.push(user);
        this.userList = newUserList;
        console.log('new user list:', this.userList);
        resolve(true);
      } else {
        resolve(false);
      }
    })
  }

  login(user: UserLogin): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let userFound: UserLogin = this.userList.find(u => { return u.userName === user.userName && u.password === user.password });
      if (userFound) {
        let userData: UserAuth = {
          userName: userFound.userName,
          isAuthenticated: true
        }
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
