import { Injectable } from '@angular/core';
import { UserAuth } from '../classes/user-auth';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  user: UserAuth;
  userWatchlistSubject: Subject<number[]> = new Subject();
  
  constructor() { }

  getWatchlistForUser(userName: string): number[] {
    let userWatchList: number[] = []
    let watchLists: any = JSON.parse(localStorage.getItem('watchlists'));
    if (watchLists && watchLists.hasOwnProperty(userName)) {
      if (Object.prototype.toString.call(watchLists[userName]) === '[object Array]') {
        userWatchList = watchLists[userName];
      }
    }
    return userWatchList;
  }

  addMovieToWatchlist(movieId: number, userName: string): void {
    let watchLists: any = JSON.parse(localStorage.getItem('watchlists')) || {};
    if (!watchLists.hasOwnProperty(userName)) {
      watchLists[userName] = [];
    }
    if (watchLists[userName].indexOf(movieId) === -1) {
      watchLists[userName].push(movieId);
    }
    localStorage.setItem('watchlists', JSON.stringify(watchLists));
    this.userWatchlistSubject.next(watchLists[userName]);
  }

  removeMovieFromWathlist(movieId: number, userName: string): void {
    let watchLists: any = JSON.parse(localStorage.getItem('watchlists'));
    if (watchLists.hasOwnProperty(userName)) {
      if (Object.prototype.toString.call(watchLists[userName]) === '[object Array]') {
        const movieIdIndex: number = watchLists[userName].indexOf(movieId);
        if (movieIdIndex !== -1) {
          watchLists[userName].splice(movieIdIndex, 1);
        }
      }
    }
    localStorage.setItem('watchlists', JSON.stringify(watchLists));
    this.userWatchlistSubject.next(watchLists[userName]);
  }
}
