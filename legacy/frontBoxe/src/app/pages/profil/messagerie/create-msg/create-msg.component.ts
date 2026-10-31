import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../../services/message.service';
import { AuthService } from '../../../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import Message from '../../../../models/message.models';

@Component({
  selector: 'app-create-msg',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './create-msg.component.html',
  styleUrls: ['./create-msg.component.css'], // Correction: styleUrls (pluriel)
  providers: [DatePipe], // Assurez-vous que DatePipe est fourni
})
export class CreateMsgComponent implements OnInit {
  // Constructeur avec services injectés
  constructor(
    private datePipe: DatePipe,
    private messageService: MessageService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  messages: Message[] = []; // Variable pour stocker la liste des messages
  role: string | null = null; // Variable pour stocker le rôle de l'utilisateur
  createMsg!: FormGroup; // FormGroup pour créer un message
  formattedDate!: string | null; // Variable pour stocker la date formatée

  // Méthode appelée après l'initialisation des propriétés injectées
  ngOnInit(): void {
    // Initialisation de la date formatée après l'injection de datePipe
    this.formattedDate = this.datePipe.transform(
      new Date(),
      "yyyy-MM-dd'T'HH:mm:ssZZZZZ"
    );

    // Initialisation du formulaire après l'injection de formBuilder
    this.createMsg = this.formBuilder.group({
      contenu: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(500),
        ],
      ],
      destinataire: ['', [Validators.required, Validators.minLength(2)]],
      expediteur: ['', [Validators.required, Validators.minLength(2)]],
      msgDate: ['', [Validators.required]],
    });
  }

  // Méthode pour créer un message
  createMessage(): void {
    // Met à jour la date dans le formulaire
    this.createMsg.patchValue({ msgDate: this.formattedDate });

    // Vérification si le formulaire est valide avant de procéder
    if (this.createMsg.valid) {
      this.messageService.createMessage(this.createMsg.value).subscribe({
        next: () => {
          console.log(this.createMsg.value.msgDate); // Tester la valeur dans la console
          // Actualise la liste des messages
          this.messageService.getAllMessages().subscribe({
            next: (responseMsg) => (this.messages = responseMsg),
            error: (err) =>
              console.error(
                'Erreur lors de la récupération des messages:',
                err
              ),
          });
          // Réinitialise le formulaire après la création
          this.createMsg.reset();
          // Récupère le rôle de l'utilisateur
          this.role = this.authService.getRole();
          // Affiche une notification si le message est créé avec succès
          alert('Message créé avec succès!');
        },
        error: (err) => {
          console.error('Erreur lors de la création du message :', err);
          alert('Une erreur est survenue lors de la création du message.');
        },
      });
    } else {
      alert('Le formulaire est invalide, veuillez vérifier les champs.');
    }
  }

  // Getter pour accéder facilement aux contrôles du formulaire
  get form() {
    return this.createMsg.controls;
  }
}
