import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// 🔗 Base API URL (your Heroku app)
const apiUrl = 'https://fierce-beach-67482-2c91e337192e.herokuapp.com/';

@Injectable({ providedIn: 'root' })
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  // Helpers
  private authHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
        'Content-Type': 'application/json'
      })
    };
  }

  private extractResponseData(res: any): any {
    return res ?? {};
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API error =>', error.status, error.message, error.error);
    return throwError(() => error);
  }

  // ========= Users =========
  registerUser(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'users', userDetails, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
      .pipe(catchError(this.handleError));
  }

  loginUser(credentials: { Username: string; Password: string }): Observable<any> {
    // Adjust if your API uses a different path for login (e.g., 'login')
    return this.http
      .post(apiUrl + 'login', credentials, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
      .pipe(catchError(this.handleError));
  }

  getUser(username: string): Observable<any> {
    return this.http
      .get(apiUrl + `users/${encodeURIComponent(username)}`, this.authHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  editUser(username: string, update: any): Observable<any> {
    return this.http
      .put(apiUrl + `users/${encodeURIComponent(username)}`, update, this.authHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  deleteUser(username: string): Observable<any> {
    return this.http
      .delete(apiUrl + `users/${encodeURIComponent(username)}`, this.authHeaders())
      .pipe(catchError(this.handleError));
  }

  // ========= Favorites =========
  getFavoriteMovies(username: string): Observable<string[] | any> {
    return this.getUser(username).pipe(
      map((u) => u?.FavoriteMovies || u?.favoriteMovies || u?.FavoriteMovieIDs || []),
      catchError(this.handleError)
    );
  }

  addFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http
      .post(apiUrl + `users/${encodeURIComponent(username)}/movies/${encodeURIComponent(movieId)}`, {}, this.authHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  removeFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http
      .delete(apiUrl + `users/${encodeURIComponent(username)}/movies/${encodeURIComponent(movieId)}`, this.authHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // ========= Movies / Directors / Genres =========
  getAllMovies(): Observable<any> {
    return this.http
      .get(apiUrl + 'movies', this.authHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  getOneMovie(title: string): Observable<any> {
    return this.http
      .get(apiUrl + `movies/${encodeURIComponent(title)}`, this.authHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  getDirector(name: string): Observable<any> {
    return this.http
      .get(apiUrl + `directors/${encodeURIComponent(name)}`, this.authHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  getGenre(name: string): Observable<any> {
    return this.http
      .get(apiUrl + `genres/${encodeURIComponent(name)}`, this.authHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
}
