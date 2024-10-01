import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NewsService } from '../../../services/news.service';
import { ActivatedRoute, Router } from '@angular/router';
import News from '../../../models/news.models';

@Component({
  selector: 'app-edit-news',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-news.component.html',
  styleUrl: './edit-news.component.css',
})
export class EditNewsComponent implements OnInit {
  news: News = {
    titre: '',
    newsContent: '',
    newsPictures: '',
    publishedAt: new Date(),
  };

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
      },
      (error) => {
        this.errorMessage =
          'Impossible de récupérer les détails de l’actualité';
      }
    );
  }

  // Soumettre le formulaire de modification
  onSubmit(): void {
    this.newsService.updateNews(this.id, this.news).subscribe(
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
