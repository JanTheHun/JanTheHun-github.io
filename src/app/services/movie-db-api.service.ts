import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MovieDbApiService {

  constructor(
    private http: HttpClient
  ) { }

  getConfiguration(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get('https://api.themoviedb.org/3/configuration').subscribe(response => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }

  getUpcomingMovieList(params?: { page?: number }): Promise<any> {

    return new Promise((resolve, reject) => {
      const pageNrQueryParam: string = params && !isNaN(params.page) ? `?page=${params.page}` : ''
      this.http.get(`https://api.themoviedb.org/3/movie/upcoming${pageNrQueryParam}`).subscribe(response => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }
}
