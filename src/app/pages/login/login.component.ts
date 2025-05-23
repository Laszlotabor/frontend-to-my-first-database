import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  useremail = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';

    this.authService
      .login({ useremail: this.useremail, password: this.password })
      .subscribe({
        next: (res) => {
          this.authService.saveToken(res.accessToken);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage =
            err.error.message || 'Login failed. Please try again.';
        },
      });
  }
}
