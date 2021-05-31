import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router,
    private movieDbService: MovieDbApiService
  ) { }

  onNavigateBack() {
    this.router.navigate(['/movies'])
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
        this.reviews = results[2].results;
        console.log('details:', this.details);
        console.log('cast:', this.cast);
        console.log('reviews:', this.reviews);
      })
      // let movieDetails: any = await this.movieDbService.getMovieDetails(Number(movieId));
      // console.log(movieDetails)
    } catch(err) {
      console.log(err);
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      // console.log(params.get('id')); 
      this.loadAllDetails(Number(params.get('id')));
    });
  
  }

}
