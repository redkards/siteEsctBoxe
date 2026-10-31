import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Message from '../../../models/message.models';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-messagerie',
  standalone: true,
  imports: [RouterLink, MessagerieComponent],
  templateUrl: './messagerie.component.html',
  styleUrl: './messagerie.component.css',
})
export class MessagerieComponent {
  messages: Message[] = [];

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMessages(); // Méthode pour charger les messages
  }

  loadMessages() {
    this.messageService.getAllMessages().subscribe((response) => {
      this.messages = response;
    });
  }

  deleteMessage(id?: number): void {
    if (id != null) {
      // Vérifie si l'id est défini
      this.messageService.deleteMessage(id).subscribe(() => {
        this.loadMessages(); // Recharge les messages après suppression
      });
    } else {
      console.error('ID is undefined');
    }
  }

  truncate(contenu: string, length: number): string {
    return contenu.length > length
      ? contenu.substring(0, length) + '...'
      : contenu;
  }
}
