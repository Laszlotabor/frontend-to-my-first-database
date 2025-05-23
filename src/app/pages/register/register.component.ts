import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username = '';
  useremail = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';

    this.authService
      .register({
        username: this.username,
        useremail: this.useremail,
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          // On successful registration, navigate to login
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage =
            err.error.message || 'Registration failed. Please try again.';
        },
      });
  }
}
