import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, FormsModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css',
})
export class InscriptionComponent {
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
    this.user = this.formBuilder.group(
      {
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
        confirmPassword: [
          '',
          [
            Validators.required,
            // Validators.pattern(
            //   /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g
            // ),
          ],
        ],

        nom: [
          '',
          [
            Validators.required,
            // Validators.pattern(/^[a-zA-Z]+$/),
          ],
        ],

        prenom: [
          '',
          [
            Validators.required,
            // Validators.pattern(/^[a-zA-Z]+$/),
          ],
        ],

        tel: [
          '',
          [
            Validators.required,
            // Validators.pattern(/^[0-9]{10}$/),
          ],
        ],

        dateNaissance: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  // Méthode appelée lors de l'initialisation du composant
  ngOnInit(): void {}

  // Validateur personnalisé pour vérifier la correspondance des mots de passe
  private passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    if (password && confirmPassword) {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
      } else {
        confirmPassword.setErrors(null);
      }
    }
  }

  // Méthode appelée lors de la soumission du formulaire
  onSubmit() {
    this.submitted = true; // Indique que le formulaire a été soumis
    if (this.user.invalid) {
      return false; // Si le formulaire est invalide, on arrête la soumission
    } else {
      this.addUser(); // Sinon, on ajoute l'utilisateur
      return true;
    }
  }

  // Méthode privée pour ajouter un utilisateur
  private addUser() {
    const userData = {
      email: this.user.value.username,
      password: this.user.value.password,
      nom: this.user.value.nom,
      prenom: this.user.value.prenom,
      tel: this.user.value.tel,
      dateNaissance: this.user.value.dateNaissance,
      messagerieId: this.user.value.messagerieId,
    };
    this.authService.register(userData).subscribe({
      next: () => {
        alert('Inscription effectuée avec succès !');
        this.user.reset(); // Réinitialisation du formulaire
        this.submitted = false; // Réinitialisation de l'indicateur de soumission
        this.router.navigate(['/login']); // Redirection vers la page de login
      },
      error: (error) => {
        console.error("Erreur lors de l'inscription.", error);
        if (error.error) {
          console.error("Détails de l'erreur:", error.error);
        }
      },
    });
  }

  // Getter pour accéder facilement aux contrôles du formulaire dans le template
  get form() {
    return this.user.controls;
  }
}
