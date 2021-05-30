import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MovieDbApiService } from 'src/app/services/movie-db-api.service'

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {

  movieDetails: any;

  constructor(
    public dialog: MatDialogRef<MovieDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private movieDbService: MovieDbApiService
  ) { }

  onCloseDialog(): void {
    this.dialog.close()
  }

  ngOnInit(): void {
    console.log(this.data);
  }

}
