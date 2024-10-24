import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-menu',
  templateUrl: './news-menu.component.html',
  styleUrls: ['./news-menu.component.css'],
})
export class NewsMenuComponent {
  constructor(private router: Router) {}

  navigateToAddNews() {
    this.router.navigate(['/addNews']);
  }

  navigateToEditNews() {
    this.router.navigate(['/editNews']);
  }
}
