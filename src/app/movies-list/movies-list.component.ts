import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss']
})
export class MoviesListComponent implements OnInit {
  movies: any[] = [];
  error: string | null = null;

  constructor(public fetchApiData: FetchApiDataService) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe({
      next: (resp: any) => {
        this.movies = resp || [];
        this.error = null;
      },
      error: (err: any) => {
        this.error = err?.message || 'Failed to load movies';
      }
    });
  }
}
