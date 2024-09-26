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

  // Function called when a file is selected
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile.name);

      // Preview the image immediately after selection
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
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
