import { Component } from '@angular/core';
import { MovieDbApiService } from 'src/app/services/movie-db-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  configuration: any;
  totalPages: number;
  totalResults: number;
  moviesList: any[] = [];
  lastLoadedPage: number;

  constructor(
    private movieDbService: MovieDbApiService
  ) {}


  loadUpcomingMovies(page?: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
        let dto: any = {};
        if (!isNaN(page)) {
          dto.page = page;
        }
        this.movieDbService.getUpcomingMovieList(dto)
          .then(upcomingMoviesResponse => {
            resolve(upcomingMoviesResponse);
          })
          .catch(error => {
            reject(error);
          })
    })
  }

  initializeMovieList(totalResults: number) {
    this.totalResults = totalResults;
    this.moviesList = Array(this.totalResults).fill(null);
  }

  insertPageIntoMoviesList(page: number, movies: any[]) {
    let newMoviesList: any[] = [...this.moviesList];
    newMoviesList.splice((page - 1) * 20, movies.length, ...movies);
    this.moviesList = newMoviesList;
    this.lastLoadedPage = page;
  }

  async initializeApp(): Promise<void> {
    try {
      this.configuration = await this.movieDbService.getConfiguration();
      console.log(this.configuration)
      let upcomingMovies: any = await this.loadUpcomingMovies();
      this.totalPages = upcomingMovies.total_pages;
      this.initializeMovieList(upcomingMovies.total_results);
      this.insertPageIntoMoviesList(1, upcomingMovies.results);
    } catch(err) {
      console.log(err)
    }
  }

  ngOnInit(): void {
    this.initializeApp();
  }

}
