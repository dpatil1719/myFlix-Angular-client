import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

// IMPORTANT: backend routes are NOT prefixed with /api
const apiUrl = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Bearer ' + this.getToken(),
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API error:', error);
    const message =
      typeof error.error === 'string'
        ? error.error
        : (error.error?.message || 'Something went wrong; please try again later.');
    return throwError(() => new Error(message));
  }

  // ===== Auth =====
  userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      tap((result: any) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
      }),
      catchError(this.handleError)
    );
  }

  // ===== Movies =====
  getAllMovies(): Observable<any> {
    return this.http.get(apiUrl + 'movies', {
      headers: this.authHeaders()
    }).pipe(catchError(this.handleError));
  }
}
