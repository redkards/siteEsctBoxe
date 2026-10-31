import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../../services/news.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-news.component.html',
  styleUrl: './floating-news.component.css',
})
export class FloatingNewsComponent implements OnInit {
  news: any[] = [];
  showNews: boolean = true;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.getLatestNews();
  }

  getLatestNews(): void {
    this.newsService.getAllNews().subscribe((data: any) => {
      this.news = data;
    });
  }

  closeNews(): void {
    this.showNews = false;
  }
}
