import { Component, ViewChild, ElementRef } from '@angular/core';
import { SliderProfilComponent } from '../../commons/slider-profil/slider-profil.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [SliderProfilComponent, CommonModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
})
export class ProfilComponent {
  selectedFile: File | null = null;
  uploadResponse: string = '';
  imagePreview: string | ArrayBuffer | null = 'icon/utilisateur.png'; // Image par défaut
  userId: number | null = null; // Pour stocker l'ID de l'utilisateur

  @ViewChild('fileInput') fileInput!: ElementRef; // Référence à l'input file

  constructor(private http: HttpClient, private authService: AuthService) {
    this.userId = this.authService.getUserId(); // Récupère l'ID de l'utilisateur à la création
  }

  // Fonction appelée quand un fichier est sélectionné
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Fichier sélectionné :', this.selectedFile.name);

      // Prévisualiser l'image immédiatement après la sélection
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Fonction pour uploader le fichier à l'API Symfony
  async uploadFile(): Promise<void> {
    if (this.selectedFile && this.userId) {
      try {
        const formData = new FormData();
        formData.append('file', this.selectedFile);

        // Envoyer le fichier au backend Symfony à l'endpoint de profil
        this.http
          .post(
            `http://localhost:8000/api/users/${this.userId}/upload-profile-picture`,
            formData
          )
          .subscribe(
            (response: any) => {
              this.uploadResponse = 'Fichier téléchargé avec succès !';
              console.log(response); // Pour voir la réponse complète

              // Réinitialiser le composant sans recharger la page
              this.resetComponentState();
            },
            (error) => {
              this.uploadResponse = 'Erreur lors du téléchargement du fichier.';
              console.error(error);
            }
          );
      } catch (error) {
        console.error("Erreur lors de l'upload du fichier:", error);
        this.uploadResponse = "Erreur lors de l'upload du fichier.";
      }
    } else {
      console.error('Aucun fichier sélectionné ou utilisateur non connecté.');
      this.uploadResponse = 'Veuillez sélectionner un fichier.';
    }
  }

  // Fonction pour réinitialiser l'état du composant
  resetComponentState(): void {
    this.selectedFile = null;
    this.uploadResponse = '';
    this.fileInput.nativeElement.value = ''; // Réinitialiser l'input file
  }
}
