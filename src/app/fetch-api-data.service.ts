import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError<any>));
  }

  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError<any>));
  }

  public getAllMovies(): Observable<any[]> {
    const token = localStorage.getItem('token') || '';
    return this.http
      .get<any[]>(apiUrl + 'movies', {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
      })
      .pipe(catchError(this.handleError<any[]>));
  }

  public editUser(username: string, userDetails: any): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http
      .put(apiUrl + 'users/' + username, userDetails, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
      })
      .pipe(catchError(this.handleError<any>));
  }

  private handleError<T>(error: any): Observable<T> {
    console.error('API error:', error);
    return throwError(() => error);
  }
}
