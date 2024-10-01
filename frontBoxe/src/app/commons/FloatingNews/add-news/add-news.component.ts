import { Component } from '@angular/core';
import { NewsService } from '../../../services/news.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-news',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-news.component.html',
  styleUrl: './add-news.component.css',
})
export class AddNewsComponent {
  titre: string = '';
  newsContent: string = '';
  newsPictures?: string = '';
  publishedAt: Date = new Date();

  constructor(private newsService: NewsService, private router: Router) {}

  createNews(): void {
    const news = {
      titre: this.titre,
      newsContent: this.newsContent,
      publishedAt: this.publishedAt,
    };
    this.newsService.createNews(news).subscribe(() => {
      this.router.navigate(['/news']);
    });
  }
}
