import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../../services/news.service';
import { ActivatedRoute, Router } from '@angular/router';
import News from '../../../models/news.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-news',
  standalone: true,
  imports: [CommonModule, FormsModule], // Ajouter FormsModule ici
  templateUrl: './edit-news.component.html',
  styleUrls: ['./edit-news.component.css'],
})
export class EditNewsComponent implements OnInit {
  news: News = new News('', '', new Date());
  titre: string = '';
  newsContent: string = '';
  newsPictures?: string = '';
  errorMessage: string | null = null;
  id: number;

  constructor(
    private newsService: NewsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Récupérer l'ID de l'actualité à partir de l'URL
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    // Récupérer les détails de l'actualité à modifier
    this.newsService.getNewsDetail(this.id).subscribe(
      (data) => {
        this.news = data;
        this.titre = data.titre;
        this.newsContent = data.newsContent;
        this.newsPictures = data.newsPictures;
      },
      (error) => {
        this.errorMessage =
          'Impossible de récupérer les détails de l’actualité';
      }
    );
  }

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

  updateNews(): void {
    const updatedNews = new News(
      this.titre,
      this.newsContent,
      new Date(), // Vous pouvez ajuster la date selon vos besoins
      this.newsPictures
    );

    this.newsService.updateNews(this.id, updatedNews).subscribe(
      () => {
        // Redirection vers la page de la liste d'actualités après succès
        this.router.navigate(['/news']);
      },
      (error) => {
        this.errorMessage = 'Échec de la modification de l’actualité';
      }
    );
  }
}
