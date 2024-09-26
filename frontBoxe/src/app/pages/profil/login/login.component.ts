import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private tokenKey = 'token'; // Key for storing the token in localStorage

  // Initialize the loginForm in the constructor
  loginForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private formB: FormBuilder, // Injecting FormBuilder
    private authService: AuthService,
    private router: Router // Inject Router to navigate after login
  ) {
    // Initializing the form inside the constructor
    this.loginForm = this.formB.group({
      username: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
        ],
      ],
      password: ['', [Validators.required]],
    });
  }

  // Login submission logic
  onLogin(): any {
    console.log(this.loginForm.value);

    if (this.loginForm.invalid) {
      console.log('Form is invalid');
      return false; // Return false if form is invalid
    }

    this.authService.login(this.loginForm.value).subscribe((data) => {
      console.log(data);
      this.submitted = true; // Mark form as submitted

      // Navigate to the home page after successful login
      this.router.navigate(['profil']);
    });
  }

  // Method to get user role from the token
  getRole(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
        return payload.roles ? payload.roles[0] : null; // Return the first role found
      } catch (e) {
        console.error('Invalid token format', e); // Log an error if the token format is invalid
        return null;
      }
    }
    return null; // Return null if no token is found
  }

  // Getter to access form controls
  get form() {
    return this.loginForm.controls;
  }
}
