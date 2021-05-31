import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

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

  getMovieDetails(movieId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`https://api.themoviedb.org/3/movie/${movieId}`).subscribe(response => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }

  getMovieCredits(movieId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`).subscribe(response => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }

  getMovieReviews(movieId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`https://api.themoviedb.org/3/movie/${movieId}/reviews`).subscribe(response => {
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

  getMovieList(params: any): Promise<any> {
    let queryParams: any = new HttpParams()
    queryParams = queryParams.append('release_date.lte', params.date);
    queryParams = queryParams.append('page', params.page);
    return new Promise((resolve, reject) => {
      this.http.get('https://api.themoviedb.org/3/discover/movie', { params: queryParams }).subscribe(response => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }
}
