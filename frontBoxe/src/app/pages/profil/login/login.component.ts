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
  loginForm: FormGroup;
  submitted: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private formB: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formB.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  // Connexion puis redirection vers le profil
  onLogin(): void {
    this.submitted = true;
    this.errorMessage = null;
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['profil']),
      error: () => (this.errorMessage = 'Email ou mot de passe incorrect.'),
    });
  }

  // Accès aux contrôles du formulaire dans le template
  get form() {
    return this.loginForm.controls;
  }
}
