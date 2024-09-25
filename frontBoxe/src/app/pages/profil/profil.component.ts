import { Component } from '@angular/core';
import { SliderProfilComponent } from '../../commons/slider-profil/slider-profil.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [SliderProfilComponent, CommonModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css',
})
export class ProfilComponent {
  selectedFile: File | null = null;
  uploadResponse: string = '';

  constructor(private http: HttpClient) {}

  // Fonction appelée quand un fichier est sélectionné
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Fichier sélectionné :', this.selectedFile.name);
    }
  }

  // Fonction pour uploader le fichier à l'API Symfony
  uploadFile(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      // Envoyer le fichier au backend Symfony
      this.http.post('http://localhost:8000/api/upload', formData).subscribe(
        (response: any) => {
          this.uploadResponse = 'Fichier téléchargé avec succès !';
        },
        (error) => {
          this.uploadResponse = 'Erreur lors du téléchargement du fichier.';
          console.error(error);
        }
      );
    } else {
      console.error('Aucun fichier sélectionné');
    }
  }
}
