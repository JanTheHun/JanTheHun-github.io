import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MovieDbApiService {

  constructor(
    private http: HttpClient
  ) { }

  getUpcomingMovieList(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http.get('https://api.themoviedb.org/3/movie/upcoming').subscribe(response => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }
}
