import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// ✅ Your hosted API base URL (trailing slash kept)
const apiUrl = '/api/';

@Injectable({ providedIn: 'root' })
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  /** Helpers */
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private headers(json: boolean = false): HttpHeaders {
    let h = new HttpHeaders();
    if (json) h = h.set('Content-Type', 'application/json');
    const t = this.getToken();
    if (t) h = h.set('Authorization', 'Bearer ' + t);
    return h;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Client/network error:', error.error.message);
    } else {
      console.error(`API error ${error.status}:`, error.error);
    }
    return throwError(() => error);
  }

  /** ---- AUTH & USER ---- */

  /** Register a new user */
  public userRegistration(user: any): Observable<any> {
    return this.http
      .post(apiUrl + 'users', user, { headers: this.headers(true) })
      .pipe(catchError(this.handleError));
  }

  /** Login and store token/user in localStorage */
  public userLogin(credentials: {
    Username: string;
    Password: string;
  }): Observable<any> {
    return this.http
      .post(apiUrl + 'login', credentials, { headers: this.headers(true) })
      .pipe(
        map((res: any) => {
          if (res?.token) localStorage.setItem('token', res.token);
          if (res?.user) localStorage.setItem('user', JSON.stringify(res.user));
          return res;
        }),
        catchError(this.handleError)
      );
  }

  /** Get a single user by username */
  public getUser(username: string): Observable<any> {
    return this.http
      .get(apiUrl + 'users/' + encodeURIComponent(username), {
        headers: this.headers(),
      })
      .pipe(catchError(this.handleError));
  }

  /** Edit a user */
  public editUser(username: string, update: any): Observable<any> {
    return this.http
      .put(apiUrl + 'users/' + encodeURIComponent(username), update, {
        headers: this.headers(true),
      })
      .pipe(catchError(this.handleError));
  }

  /** Delete a user */
  public deleteUser(username: string): Observable<any> {
    return this.http
      .delete(apiUrl + 'users/' + encodeURIComponent(username), {
        headers: this.headers(),
      })
      .pipe(catchError(this.handleError));
  }

  /** Favorite movies for a user (derived from user payload) */
  public getFavoriteMovies(username: string): Observable<string[] | any> {
    return this.getUser(username).pipe(
      map((u: any) => u?.FavoriteMovies || u?.favoriteMovies || []),
      catchError(this.handleError)
    );
  }

  /** Add favorite movie */
  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http
      .post(
        apiUrl +
          'users/' +
          encodeURIComponent(username) +
          '/movies/' +
          encodeURIComponent(movieId),
        {},
        { headers: this.headers(true) }
      )
      .pipe(catchError(this.handleError));
  }

  /** Remove favorite movie */
  public removeFavoriteMovie(
    username: string,
    movieId: string
  ): Observable<any> {
    return this.http
      .delete(
        apiUrl +
          'users/' +
          encodeURIComponent(username) +
          '/movies/' +
          encodeURIComponent(movieId),
        { headers: this.headers() }
      )
      .pipe(catchError(this.handleError));
  }

  /** ---- MOVIES, DIRECTORS, GENRES ---- */

  /** Get all movies */
  public getAllMovies(): Observable<any> {
    return this.http
      .get(apiUrl + 'movies', { headers: this.headers() })
      .pipe(catchError(this.handleError));
  }

  /** Get one movie by title */
  public getOneMovie(title: string): Observable<any> {
    return this.http
      .get(apiUrl + 'movies/' + encodeURIComponent(title), {
        headers: this.headers(),
      })
      .pipe(catchError(this.handleError));
  }

  /** Get director details by name */
  public getDirector(name: string): Observable<any> {
    return this.http
      .get(apiUrl + 'directors/' + encodeURIComponent(name), {
        headers: this.headers(),
      })
      .pipe(catchError(this.handleError));
  }

  /** Get genre details by name */
  public getGenre(name: string): Observable<any> {
    return this.http
      .get(apiUrl + 'genres/' + encodeURIComponent(name), {
        headers: this.headers(),
      })
      .pipe(catchError(this.handleError));
  }
}
