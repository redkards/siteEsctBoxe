import { Component } from '@angular/core';

@Component({
  selector: 'app-inscription2024-2025',
  standalone: true,
  imports: [],
  templateUrl: './inscription2024-2025.component.html',
  styleUrl: './inscription2024-2025.component.css',
})
export class Inscription20242025Component {
  download() {
    const downloadLink = document.createElement('a');
    downloadLink.click();
  }
}
