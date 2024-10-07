import { Component, ViewChild, ElementRef } from '@angular/core';
import { SliderProfilComponent } from '../../commons/slider-profil/slider-profil.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
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
  imagePreview: string | ArrayBuffer | null = 'icon/utilisateur.png'; // Default image
  userId: number | null = null; // To store the authenticated user's ID

  @ViewChild('fileInput') fileInput!: ElementRef; // Reference to the file input

  constructor(private http: HttpClient, private authService: AuthService) {
    this.userId = this.authService.getUserId(); // Get the authenticated user's ID
  }

  // // fonction pour selectionner une image
  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.selectedFile = input.files[0];
  //     console.log('Selected file:', this.selectedFile.name);

  //     // aperçu de l'image après selection
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.imagePreview = reader.result;
  //     };
  //     reader.readAsDataURL(this.selectedFile);
  //   }
  // }
  // Fonction pour sélectionner une image à partir d'un événement déclenché (par exemple, lors du choix d'un fichier dans un input de type "file")
onFileSelected(event: Event): void {
  // Récupération de l'élément input à partir de l'événement et conversion en HTMLInputElement
  const input = event.target as HTMLInputElement;

  // Vérification si des fichiers sont sélectionnés et s'il y a au moins un fichier dans la liste
  if (input.files && input.files.length > 0) {
    // Sélectionne le premier fichier dans la liste et le stocke dans la variable "selectedFile"
    this.selectedFile = input.files[0];

    // Affiche le nom du fichier sélectionné dans la console pour vérification
    console.log('Fichier sélectionné:', this.selectedFile.name);

    // Création d'une instance de FileReader pour lire le fichier et générer un aperçu
    const reader = new FileReader();

    // Lorsque la lecture est terminée, stocke le résultat (l'aperçu de l'image) dans la variable "imagePreview"
    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    // Lit le fichier sélectionné sous forme de Data URL (base64), utile pour l'aperçu de l'image dans une balise <img>
    reader.readAsDataURL(this.selectedFile);
  }
}


  // Function to upload the file to the Symfony backend and associate it with the user
  uploadFile(): void {
    if (this.selectedFile && this.userId !== null) {
      // Ensure a file is selected and user ID exists
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('userId', this.userId.toString()); // Attach the user ID

      // Send the file to the Symfony FileUploadController
      this.http.post('http://localhost:8000/api/upload', formData).subscribe(
        (response: any) => {
          this.uploadResponse = 'File uploaded successfully!';

          // After successful upload, associate the file with the user in UserController
          this.associateFileWithUser(response.filePath); // Assuming the response contains the file path
        },
        (error) => {
          this.uploadResponse = 'Error uploading the file.';
          console.error(error);
        }
      );
    } else {
      console.error('No file selected or user not authenticated.');
      this.uploadResponse =
        'Please select a file and ensure you are authenticated.';
    }
  }

  // Function to associate the uploaded file with the user in the UserController
  associateFileWithUser(filePath: string): void {
    if (this.userId) {
      const data = {
        userId: this.userId,
        filePath: filePath,
      };

      this.http
        .post('http://localhost:8000/api/user/update-profile-picture', data)
        .subscribe(
          (response: any) => {
            console.log('Profile picture updated for the user:', response);
          },
          (error) => {
            console.error('Error updating profile picture:', error);
          }
        );
    }
  }

  // Function to reset the component state
  resetComponentState(): void {
    this.selectedFile = null;
    this.uploadResponse = '';
    this.fileInput.nativeElement.value = ''; // Reset the file input
  }
}
