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
  userId: number | null = null; // Declare the userId property

  @ViewChild('fileInput') fileInput!: ElementRef; // Reference to the file input

  constructor(private http: HttpClient, private authService: AuthService) {
    this.userId = this.authService.getUserId(); // Initialize the userId
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

  // Function to check if the file already exists in the API
  checkFileExists(fileName: string): Promise<boolean> {
    return firstValueFrom(
      this.http.get<boolean>(
        `http://localhost:8000/api/check-file-exists/${fileName}`
      )
    )
      .then((response) => {
        return response !== undefined ? response : false; // Return false if the response is undefined
      })
      .catch((error) => {
        console.error('Error checking file existence:', error);
        return false; // If an error occurs, assume the file doesn't exist
      });
  }

  // Function to upload the file to the Symfony API
  async uploadFile(): Promise<void> {
    if (this.selectedFile) {
      try {
        // Check if the file already exists in the API
        const fileExists = await this.checkFileExists(this.selectedFile.name);

        if (fileExists) {
          this.uploadResponse = 'The file already exists on the server.';
          console.log('The file already exists.');
        } else {
          // If the file doesn't exist, proceed with the upload
          const formData = new FormData();
          formData.append('file', this.selectedFile);

          // Send the file to the Symfony backend
          this.http
            .post('http://localhost:8000/api/upload', formData)
            .subscribe(
              (response: any) => {
                this.uploadResponse = 'File uploaded successfully!';

                // Reset the component state without reloading the page
                this.resetComponentState();
              },
              (error) => {
                this.uploadResponse = 'Error uploading the file.';
                console.error(error);
              }
            );
        }
      } catch (error) {
        console.error('Error checking file:', error);
        this.uploadResponse = 'Error checking file.';
      }
    } else {
      console.error('No file selected.');
      this.uploadResponse = 'Please select a file.';
    }
  }

  // Function to reset the component state
  resetComponentState(): void {
    this.selectedFile = null;
    this.uploadResponse = '';
    this.fileInput.nativeElement.value = ''; // Reset the file input
  }
}
