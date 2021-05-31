import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MovieDbApiService } from 'src/app/services/movie-db-api.service';
import { WatchlistService } from 'src/app/services/watchlist.service';
import { UserAuth } from 'src/app/classes/user-auth';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {

  watchlist: any[] = []
  movieList: any[] = []
  configuration: any;

  constructor(
    private authenticationService: AuthenticationService,
    private watchlistService: WatchlistService,
    private location: Location,
    private movieDbService: MovieDbApiService
  ) { }

  onNavigateBack() {
    this.location.back();
  }

  loadMovieDetails() {
    let apiCalls: any[] = []
    this.watchlist.forEach(w => {
      apiCalls.push(this.movieDbService.getMovieDetails(w));
    })
    Promise.all(apiCalls).then(result => {

      let processedMoviesList: any[] = [...result].map(m => {
        if (m.backdrop_path) {
          m.imageURI = this.configuration.images.secure_base_url.concat('w300').concat(m.backdrop_path);
        } else if (m.poster_path) {
          m.imageURI = this.configuration.images.secure_base_url.concat('w300').concat(m.poster_path);
          console.log('using poster path:', m.title);
        } else {
          m.imageURI = null
          console.log('no image:', m.title);
        }
        return m
      })


      this.movieList = processedMoviesList;
    })
  }

  ngOnInit(): void {
    this.movieDbService.configurationSubject.subscribe(configuration => {
      this.configuration = configuration;
      if (this.configuration) {
        let user: UserAuth = this.authenticationService.getActiveUser();
        this.watchlist = this.watchlistService.getWatchlistForUser(user.userName);
        this.loadMovieDetails();
        this.authenticationService.activeUserSubject.subscribe(user => {
          this.watchlist = user.watchList;
          let newMovieList: any[] = [...this.movieList].filter(m => {
            return this.watchlist.indexOf(m.id) !== -1;
          })
          this.movieList = newMovieList;
        })
      }
    })    
  }
}
