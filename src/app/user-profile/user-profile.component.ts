import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any = null;

  editData = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: ''
  };

  isSaving = false;

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ simple auth check
    const token = localStorage.getItem('token');
    if (!token) {
      this.snackBar.open('Please login first.', 'OK', { duration: 2000 });
      this.router.navigate(['welcome']);
      return;
    }

    this.loadUserFromStorage();
  }

  loadUserFromStorage(): void {
    const stored = localStorage.getItem('user');
    this.user = stored ? JSON.parse(stored) : null;

    this.editData.Username = this.user?.Username || '';
    this.editData.Email = this.user?.Email || '';
    this.editData.Birthday = this.user?.Birthday || '';
    this.editData.Password = '';
  }

  saveProfile(): void {
    if (!this.user?.Username) {
      this.snackBar.open('No user found in localStorage. Please login again.', 'OK', { duration: 2500 });
      this.router.navigate(['welcome']);
      return;
    }

    const payload: any = {};
    if (this.editData.Username && this.editData.Username !== this.user.Username) payload.Username = this.editData.Username;
    if (this.editData.Email && this.editData.Email !== this.user.Email) payload.Email = this.editData.Email;
    if (this.editData.Birthday !== undefined && this.editData.Birthday !== this.user.Birthday) payload.Birthday = this.editData.Birthday;
    if (this.editData.Password && this.editData.Password.length > 0) payload.Password = this.editData.Password;

    if (Object.keys(payload).length === 0) {
      this.snackBar.open('Nothing to update.', 'OK', { duration: 1500 });
      return;
    }

    this.isSaving = true;

    this.fetchApiData.editUser(this.user.Username, payload).subscribe({
      next: (updatedUser: any) => {
        this.isSaving = false;

        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.user = updatedUser;

        this.editData.Username = updatedUser.Username || '';
        this.editData.Email = updatedUser.Email || '';
        this.editData.Birthday = updatedUser.Birthday || '';
        this.editData.Password = '';

        this.snackBar.open('Profile updated!', 'OK', { duration: 2000 });
      },
      error: (err: any) => {
        this.isSaving = false;
        console.error('Update profile error:', err);
        this.snackBar.open(err?.error || err?.message || 'Update failed', 'OK', { duration: 2500 });
      }
    });
  }

  goMovies(): void {
    this.router.navigate(['movies']);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['welcome']);
  }
}
