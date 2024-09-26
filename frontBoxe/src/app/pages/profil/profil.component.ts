// import { Component } from '@angular/core';
// import { SliderProfilComponent } from '../../commons/slider-profil/slider-profil.component';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-profil',
//   standalone: true,
//   imports: [SliderProfilComponent, CommonModule],
//   templateUrl: './profil.component.html',
//   styleUrl: './profil.component.css',
// })
// export class ProfilComponent {
//   selectedFile: File | null = null;
//   uploadResponse: string = '';

//   constructor(private http: HttpClient) {}

//   // Fonction appelée quand un fichier est sélectionné
//   onFileSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.selectedFile = input.files[0];
//       console.log('Fichier sélectionné :', this.selectedFile.name);
//     }
//   }

//   // Fonction pour uploader le fichier à l'API Symfony
//   uploadFile(): void {
//     if (this.selectedFile) {
//       const formData = new FormData();
//       formData.append('file', this.selectedFile);

//       // Envoyer le fichier au backend Symfony
//       this.http.post('http://localhost:8000/api/upload', formData).subscribe(
//         (response: any) => {
//           this.uploadResponse = 'Fichier téléchargé avec succès !';
//         },
//         (error) => {
//           this.uploadResponse = 'Erreur lors du téléchargement du fichier.';
//           console.error(error);
//         }
//       );
//     } else {
//       console.error('');
//     }
//   }
// }

//************************************************************************************************************************

// import { Component, ViewChild, ElementRef } from '@angular/core';
// import { SliderProfilComponent } from '../../commons/slider-profil/slider-profil.component';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { firstValueFrom } from 'rxjs';

// @Component({
//   selector: 'app-profil',
//   standalone: true,
//   imports: [SliderProfilComponent, CommonModule],
//   templateUrl: './profil.component.html',
//   styleUrls: ['./profil.component.css'],
// })
// export class ProfilComponent {
//   selectedFile: File | null = null;
//   uploadResponse: string = '';
//   imagePreview: string | ArrayBuffer | null = 'img/boxeur dessin.png'; // Image par défaut

//   @ViewChild('fileInput') fileInput!: ElementRef; // Référence à l'input file

//   constructor(private http: HttpClient) {}

//   // Fonction appelée quand un fichier est sélectionné
//   onFileSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.selectedFile = input.files[0];
//       console.log('Fichier sélectionné :', this.selectedFile.name);

//       // Prévisualiser l'image immédiatement après la sélection
//       const reader = new FileReader();
//       reader.onload = () => {
//         this.imagePreview = reader.result;
//       };
//       reader.readAsDataURL(this.selectedFile);
//     }
//   }

//   // Fonction pour vérifier si le fichier existe déjà dans l'API
//   checkFileExists(fileName: string): Promise<boolean> {
//     return firstValueFrom(
//       this.http.get<boolean>(
//         `http://localhost:8000/api/check-file-exists/${fileName}`
//       )
//     )
//       .then((response) => {
//         return response !== undefined ? response : false; // Retourne false si la réponse est indéfinie
//       })
//       .catch((error) => {
//         console.error('Erreur lors de la vérification du fichier :', error);
//         return false; // Si une erreur survient, on considère que le fichier n'existe pas
//       });
//   }

//   // Fonction pour uploader le fichier à l'API Symfony
//   async uploadFile(): Promise<void> {
//     if (this.selectedFile) {
//       try {
//         // Vérifiez si le fichier existe déjà dans l'API
//         const fileExists = await this.checkFileExists(this.selectedFile.name);

//         if (fileExists) {
//           this.uploadResponse = 'Le fichier existe déjà sur le serveur.';
//           console.log('Le fichier existe déjà.');
//         } else {
//           // Si le fichier n'existe pas, procéder à l'upload
//           const formData = new FormData();
//           formData.append('file', this.selectedFile);

//           // Envoyer le fichier au backend Symfony
//           this.http
//             .post('http://localhost:8000/api/upload', formData)
//             .subscribe(
//               (response: any) => {
//                 this.uploadResponse = 'Fichier téléchargé avec succès !';

//                 // Réinitialiser l'input file et supprimer le nom du fichier
//                 this.resetFileInput();
//               },
//               (error) => {
//                 this.uploadResponse =
//                   'Erreur lors du téléchargement du fichier.';
//                 console.error(error);
//               }
//             );
//         }
//       } catch (error) {
//         console.error('Erreur lors de la vérification du fichier:', error);
//         this.uploadResponse = 'Erreur lors de la vérification du fichier.';
//       }
//     } else {
//       console.error('Aucun fichier sélectionné.');
//       this.uploadResponse = 'Veuillez sélectionner un fichier.';
//     }
//   }

//   // Fonction pour réinitialiser l'input file
//   resetFileInput(): void {
//     this.selectedFile = null;
//     this.fileInput.nativeElement.value = ''; // Réinitialiser l'input file
//   }
// }

//**************************************************************************************************** */

import { Component, ViewChild, ElementRef } from '@angular/core';
import { SliderProfilComponent } from '../../commons/slider-profil/slider-profil.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [SliderProfilComponent, CommonModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
  styleUrls: ['./profil.component.css'],
})
export class ProfilComponent {
  selectedFile: File | null = null;
  uploadResponse: string = '';
  imagePreview: string | ArrayBuffer | null = 'icon/utilisateur.png'; // Image par défaut

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

  // Fonction pour vérifier si le fichier existe déjà dans l'API
  checkFileExists(fileName: string): Promise<boolean> {
    return firstValueFrom(
      this.http.get<boolean>(
        `http://localhost:8000/api/check-file-exists/${fileName}`
      )
    )
      .then((response) => {
        return response !== undefined ? response : false; // Retourne false si la réponse est indéfinie
      })
      .catch((error) => {
        console.error('Erreur lors de la vérification du fichier :', error);
        return false; // Si une erreur survient, on considère que le fichier n'existe pas
      });
  }

  // Fonction pour uploader le fichier à l'API Symfony
  async uploadFile(): Promise<void> {
    if (this.selectedFile) {
      try {
        // Vérifiez si le fichier existe déjà dans l'API
        const fileExists = await this.checkFileExists(this.selectedFile.name);

        if (fileExists) {
          this.uploadResponse = 'Le fichier existe déjà sur le serveur.';
          console.log('Le fichier existe déjà.');
        } else {
          // Si le fichier n'existe pas, procéder à l'upload
          const formData = new FormData();
          formData.append('file', this.selectedFile);

          // Envoyer le fichier au backend Symfony
          this.http
            .post('http://localhost:8000/api/upload', formData)
            .subscribe(
              (response: any) => {
                this.uploadResponse = 'Fichier téléchargé avec succès !';

                // Réinitialiser le composant sans recharger la page
                this.resetComponentState();
              },
              (error) => {
                this.uploadResponse =
                  'Erreur lors du téléchargement du fichier.';
                console.error(error);
              }
            );
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du fichier:', error);
        this.uploadResponse = 'Erreur lors de la vérification du fichier.';
      }
    } else {
      console.error('Aucun fichier sélectionné.');
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

//**************************************************************************************************

// import { Component } from '@angular/core';
// import { SliderProfilComponent } from '../../commons/slider-profil/slider-profil.component';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-profil',
//   standalone: true,
//   imports: [SliderProfilComponent, CommonModule],
//   templateUrl: './profil.component.html',
//   styleUrl: './profil.component.css',
// })
// export class ProfilComponent {
//   selectedFile: File | null = null;
//   uploadResponse: string = '';

//   constructor(private http: HttpClient) {}

//   // Fonction appelée quand un fichier est sélectionné
//   onFileSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.selectedFile = input.files[0];
//       console.log('Fichier sélectionné :', this.selectedFile.name);
//     }
//   }

//   // Fonction pour uploader le fichier à l'API Symfony
//   uploadFile(): void {
//     if (this.selectedFile) {
//       const formData = new FormData();
//       formData.append('file', this.selectedFile);

//       // Envoyer le fichier au backend Symfony
//       this.http.post('http://localhost:8000/api/upload', formData).subscribe(
//         (response: any) => {
//           this.uploadResponse = 'Fichier téléchargé avec succès !';
//         },
//         (error) => {
//           this.uploadResponse = 'Erreur lors du téléchargement du fichier.';
//           console.error(error);
//         }
//       );
//     } else {
//       console.error('Aucun fichier sélectionné');
//     }
//   }
// }
