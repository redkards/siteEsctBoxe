import { Component } from '@angular/core';
import { FloatingNewsComponent } from '../../commons/FloatingNews/floating-news/floating-news.component';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [FloatingNewsComponent],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css',
})
export class AccueilComponent {}
