import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  user: FormGroup; // Déclaration du formulaire de type FormGroup
  submitted: boolean = false; // Indicateur de soumission du formulaire
  selectedEcoleId: number | null = null; // ID de l'école sélectionnée

  // Constructeur avec injection des services nécessaires
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Initialisation du formulaire avec les contrôles et leurs validateurs
    this.user = this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.email,
          // Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/g),
        ],
      ], // Ajoutez Validators.email pour valider l'email
      password: [
        '',
        [
          Validators.required,
          // Validators.pattern(
          //   /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g
          // ),
        ],
      ],
    });
  }

  // Méthode appelée lors de l'initialisation du composant
  ngOnInit(): void {}

  // Méthode appelée lors de la soumission du formulaire
  onSubmit() {
    this.submitted = true; // Indique que le formulaire a été soumis
    if (this.user.invalid) {
      return false; // Si le formulaire est invalide, on arrête la soumission
    } else {
      return true;
    }
  }

  // Getter pour accéder facilement aux contrôles du formulaire dans le template
  get form() {
    return this.user.controls;
  }
}
