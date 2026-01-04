import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FetchApiDataService } from './fetch-api-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>myFlix-Angular-client</h1>
    <p>Movies API check: {{ moviesStatus }}</p>
    <p>Login test status: {{ loginStatus }}</p>
  `,
})
export class AppComponent {
  private api = inject(FetchApiDataService);
  private cdr = inject(ChangeDetectorRef);

  moviesStatus = 'Loading…';
  loginStatus = 'idle';

  ngOnInit() {
    this.api.getAllMovies().subscribe({
      next: (m) => {
        console.log('movies ok', m);
        this.moviesStatus = `OK (${Array.isArray(m) ? m.length : '?'} items)`;
        this.cdr.detectChanges(); // ensure UI updates immediately
      },
      error: (err) => {
        console.error('movies error', err);
        const code = err?.status ? `${err.status} ` : '';
        const msg = err?.message || (err?.error && JSON.stringify(err.error)) || String(err);
        this.moviesStatus = `Error: ${code}${msg}`;
        this.cdr.detectChanges();
      },
    });
  }
}
