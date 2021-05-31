import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MovieDetailsComponent } from 'src/app/components/movie-details/movie-details.component';
import { MovieDbApiService } from 'src/app/services/movie-db-api.service';
import { WatchlistService } from 'src/app/services/watchlist.service';
import { UserAuth } from 'src/app/classes/user-auth';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {

  user: UserAuth;
  @Input() movie: any;
  movieDetailsDialog: MatDialogRef<MovieDetailsComponent>;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private movieDbService: MovieDbApiService,
    private watchListService: WatchlistService,
    private authenticationService: AuthenticationService
  ) { }

  async onInfoClick(movie: any): Promise<void> {
    try {
      let movieDetails: any = await this.movieDbService.getMovieDetails(movie.id);
      this.movieDetailsDialog = this.dialog.open(MovieDetailsComponent, {
        disableClose: true,
        data: movieDetails
      });
    } catch(err) {
      console.log(err);
    }
  }

  isMovieOnWatchlist(movieId: number) {
    return this.user.watchList.indexOf(movieId) !== -1;
  }

  onAddToWatchList(movie: any): void {
    console.log(movie);
    this.watchListService.addMovieToWatchlist(movie.id, this.user.userName);
  }

  onRemoveFromWatchList(movie: any): void {
    this.watchListService.removeMovieFromWathlist(movie.id, this.user.userName);
  }

  onNavigateToDetails(movie: any): void {
    this.router.navigate(['/details', movie.id])
  }

  ngOnInit(): void {
    this.authenticationService.activeUserSubject.subscribe(user => {
      this.user = user;
    })
  }

}
