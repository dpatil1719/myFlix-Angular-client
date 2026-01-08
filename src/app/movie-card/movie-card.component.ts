import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FetchApiDataService } from '../fetch-api-data.service';
import { GenreDialogComponent } from '../genre-dialog/genre-dialog.component';
import { DirectorDialogComponent } from '../director-dialog/director-dialog.component';
import { SynopsisDialogComponent } from '../synopsis-dialog/synopsis-dialog.component';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  isLoading = false;
  errorMsg = '';

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.isLoading = true;
    this.errorMsg = '';
    this.cdr.detectChanges();

    this.fetchApiData.getAllMovies().subscribe({
      next: (resp: any) => {
        const list = Array.isArray(resp) ? resp : (resp?.data ?? resp?.movies ?? []);
        this.movies = (Array.isArray(list) ? list : []).filter((m: any) => m && typeof m === 'object');

        this.isLoading = false;
        console.log('Movies loaded:', this.movies.length);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.movies = [];
        this.isLoading = false;

        this.errorMsg =
          err?.error?.message ||
          err?.error ||
          err?.message ||
          (err?.status ? `Movies request failed (${err.status})` : 'Movies request failed');

        console.error('Movies API error:', err);
        this.cdr.detectChanges();
      }
    });
  }

  // ✅ removes "CF Sample:" prefix so UI matches your screenshot
  displayTitle(title: string): string {
    return (title || '').replace(/^CF Sample:\s*/i, '').trim();
  }

  openGenreDialog(genre: any): void {
    this.dialog.open(GenreDialogComponent, { width: '400px', data: genre });
  }

  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorDialogComponent, { width: '400px', data: director });
  }

  openSynopsisDialog(movie: any): void {
    this.dialog.open(SynopsisDialogComponent, { width: '500px', data: movie });
  }

  toggleFavorite(movie: any): void {
    movie.isFavorite = !movie.isFavorite;
  }

  posterSrc(movie: any): string {
    const p = movie?.ImagePath;
    if (!p) return '/assets/posters/placeholder.jpg';
    return p.startsWith('http') ? p : (p.startsWith('/') ? p : `/${p}`);
  }

  goProfile(): void {
    this.router.navigate(['profile']);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['welcome']);
  }

  trackByTitle = (_: number, movie: any) => movie?.Title;
}
