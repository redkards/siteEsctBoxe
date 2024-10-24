import { Component } from '@angular/core';
import { NewsService } from '../../../services/news.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import News from '../../../models/news.models';

@Component({
  selector: 'app-add-news',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.css'],
})
export class AddNewsComponent {
  titre: string = '';
  newsContent: string = '';
  newsPictures?: string = '';

  constructor(private newsService: NewsService, private router: Router) {}

  uploadPicture(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newsPictures = reader.result as string; // Convertir l'image en base64
      };
      reader.readAsDataURL(file); // Lire le fichier en tant qu'URL de données
    }
  }

  createNews(): void {
    const news = new News(
      this.titre,
      this.newsContent,
      new Date(), // La date actuelle pour publishedAt
      this.newsPictures
    );

    this.newsService.createNews(news).subscribe({
      next: () => {
        this.router.navigate(['/news']);
      },
      error: (err) => {
        console.error('Erreur lors de la création de la news : ', err);
      },
    });
  }
}
