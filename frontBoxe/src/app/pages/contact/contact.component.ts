import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Message from '../../models/message.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'], // Corrigé en `styleUrls`
  providers: [DatePipe],
})
export class ContactComponent {
  //implements OnInit {
  // messages: Message[] = [];
  // role: string | null = null;
  // public formattedDate!: string | null;
  // createMsg!: FormGroup; // Déclaration de createMsg sans initialisation
  // constructor(
  //   private datePipe: DatePipe,
  //   private messageService: MessageService,
  //   private authService: AuthService,
  //   private formBuilder: FormBuilder
  // ) {}
  // ngOnInit(): void {
  //   // Initialiser `formattedDate`
  //   this.formattedDate = this.datePipe.transform(
  //     new Date(),
  //     "yyyy-MM-dd'T'HH:mm:ssZZZZZ"
  //   );
  //   // Initialiser `createMsg` dans `ngOnInit`
  //   this.createMsg = this.formBuilder.group({
  //     content: [
  //       '',
  //       [
  //         Validators.required,
  //         Validators.minLength(5),
  //         Validators.maxLength(500),
  //       ],
  //     ],
  //     destinataire: ['', [Validators.required, Validators.minLength(2)]],
  //     expediteur: ['', [Validators.required, Validators.minLength(2)]],
  //     msgDate: ['', [Validators.required]],
  //   });
  // }
  // createMessage(): void {
  //   // crée le message
  //   this.createMsg.patchValue({ msgDate: this.formattedDate });
  //   this.messageService.addMessage(this.createMsg.value).subscribe();
  //   console.log(this.createMsg.value.msgDate); // Afficher la date dans la console pour vérification
  //   this.messageService
  //     .getAllMessages()
  //     .subscribe((responseMsg) => (this.messages = responseMsg));
  //   this.createMsg.reset();
  //   this.role = this.authService.getRole();
  //   alert('Message créé avec succès!');
  // }
  // // Accesseur pour les contrôles du formulaire
  // get form() {
  //   return this.createMsg.controls;
  // }
  formData = {
    email: '',
    message: '',
  };

  // Ajouter les propriétés successMessage et errorMessage ici
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  onSubmit() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Envoyer les données à l'API Symfony
    this.http
      .post('http://localhost:8000/api/send-email', this.formData, { headers })
      .subscribe(
        (response) => {
          console.log('Email envoyé avec succès', response);
          this.successMessage = 'Votre message a été envoyé avec succès!';
          this.errorMessage = null;
        },
        (error) => {
          console.error("Erreur lors de l'envoi de l'email", error);
          this.successMessage = null;
          this.errorMessage =
            "Une erreur est survenue lors de l'envoi de votre message.";
        }
      );
  }
}
