import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MovieDbApiService } from 'src/app/services/movie-db-api.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  details: any
  cast: any
  reviews: any

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private movieDbService: MovieDbApiService
  ) { }

  onNavigateBack() {
    this.location.back();
  }

  async loadAllDetails(movieId: number): Promise<void> {
    try {
      Promise.all([
        this.movieDbService.getMovieDetails(movieId),
        this.movieDbService.getMovieCredits(movieId),
        this.movieDbService.getMovieReviews(movieId)
      ]).then(results => {
        this.details = results[0];
        this.cast = results[1].cast;
        this.reviews = results[2].results;      })
    } catch(err) {
      console.log(err);
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.loadAllDetails(Number(params.get('id')));
    });
  
  }

}
