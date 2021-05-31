import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MovieDbApiService } from 'src/app/services/movie-db-api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MovieDetailsComponent } from 'src/app/components/movie-details/movie-details.component'
import { Router } from '@angular/router';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  @ViewChild('pageBottom') pageBottom: ElementRef

  configuration: any;
  totalPages: number;
  totalResults: number;
  moviesList: any[] = [];
  lastLoadedPage: number = 0;
  movieDetailsDialog: MatDialogRef<MovieDetailsComponent>
  dateBefore: string = '2021-05-31';

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private movieDbService: MovieDbApiService
  ) {}

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

  onNavigateToDetails(movie: any): void {
    this.router.navigate(['/details', movie.id])
  }

  onPageBottomVisible(): void {
    this.loadNextPage();
  }

  loadNextPage() {
    const nextPage: number = this.lastLoadedPage + 1;
    if (!this.totalPages || nextPage <= this.totalPages) {
      // this.movieDbService.getUpcomingMovieList({ page: nextPage })
      this.movieDbService.getMovieList({ page: nextPage, date: this.dateBefore })
        .then(upcomingMoviesResponse => {
          this.totalPages = upcomingMoviesResponse.total_pages;
          this.totalResults = upcomingMoviesResponse.total_results;
          this.insertPageIntoMoviesList(nextPage, upcomingMoviesResponse.results);
          setTimeout(() => {
            if (this.checkPageBottomVisibility()) {
              this.loadNextPage();
            }
          }, 0)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  isInViewport(element: any) {
    let isVisible: boolean = false;
    if (element) {
      const rect = element.nativeElement.getBoundingClientRect();
      isVisible = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
    return isVisible;
  }

  checkPageBottomVisibility(): Boolean {
    const isVisible = this.isInViewport(this.pageBottom);
    return isVisible
  }

  insertPageIntoMoviesList(page: number, movies: any[]) {
    console.log(movies);
    let processedMoviesList: any[] = [...movies].map(m => {
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
    let newMoviesList: any[] = [...this.moviesList].concat(processedMoviesList);
    this.moviesList = newMoviesList;
    this.lastLoadedPage = page;
  }

  async initializeApp(): Promise<void> {
    try {
      this.configuration = await this.movieDbService.getConfiguration();
    } catch(err) {
      console.log(err)
    }
  }

  ngOnInit(): void {
    this.initializeApp();
  }
}
