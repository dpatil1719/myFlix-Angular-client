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

  private readonly placeholder =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="900">
        <rect width="100%" height="100%" fill="#f3f3f3"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
              font-family="Arial" font-size="28" fill="#888">
          No Poster
        </text>
      </svg>
    `);

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

  // ✅ key fix: NEVER return "/assets/..." on GitHub Pages
  posterSrc(movie: any): string {
    let p: string = movie?.ImagePath || '';
    if (!p) return this.placeholder;

    // avoid mixed content if any URLs are http
    if (p.startsWith('http://')) p = 'https://' + p.slice('http://'.length);
    if (p.startsWith('https://')) return p;

    // if backend returns "/assets/..." strip the leading slash
    if (p.startsWith('/assets/')) return p.slice(1);

    // if already "assets/..." use as-is (base-href will handle repo subfolder)
    if (p.startsWith('assets/')) return p;

    // fallback: strip leading slash for any other relative path
    return p.replace(/^\/+/, '');
  }

  onPosterError(e: Event): void {
    const img = e.target as HTMLImageElement;
    if (img && img.src !== this.placeholder) img.src = this.placeholder;
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
