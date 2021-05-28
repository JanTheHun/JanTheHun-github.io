import { Component } from '@angular/core';
import { MovieDbApiService } from 'src/app/services/movie-db-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(
    private movieDbService: MovieDbApiService
  ) {}

  async loadUpcomingMovies() {
    try {
      let upcomingMovies: any = await this.movieDbService.getUpcomingMovieList();
      console.log(upcomingMovies);
    } catch(err) {
      console.log(err);
    }
  }

  ngOnInit() {
    this.loadUpcomingMovies();
  }

}
