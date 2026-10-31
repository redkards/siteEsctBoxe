import { Component, OnInit } from '@angular/core';
import { Boxeur } from '../../models/boxeur.models';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BoxeurService } from '../../services/boxeur.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boxeurs',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Assurez-vous que cela est présent
  templateUrl: './boxeurs.component.html',
  styleUrls: ['./boxeurs.component.css'],
})
export class BoxeurComponent implements OnInit {
  boxeurs: Boxeur[] = [];
  boxeurForm: FormGroup;
  isEdit: boolean = false;
  boxeurId: number | undefined;

  constructor(private fb: FormBuilder, private boxeurService: BoxeurService) {
    this.boxeurForm = this.fb.group({
      boxeurNom: ['', Validators.required],
      boxeurPrenom: ['', Validators.required],
      poids: [0, [Validators.required, Validators.min(0)]],
      boxeurDateNaissance: ['', Validators.required], // Ajout du champ date de naissance
    });
  }

  ngOnInit(): void {
    this.loadBoxeurs();
  }

  loadBoxeurs(): void {
    this.boxeurService.getAllBoxeurs().subscribe((boxeurs) => {
      this.boxeurs = boxeurs;
      console.log(this.boxeurs);
    });
  }

  onSubmit(): void {
    if (this.boxeurForm.valid) {
      const boxeurData = this.boxeurForm.value;
      if (this.isEdit && this.boxeurId !== undefined) {
        this.boxeurService
          .updateBoxeur(this.boxeurId, boxeurData)
          .subscribe(() => {
            this.loadBoxeurs();
            this.resetForm();
          });
      } else {
        this.boxeurService.createBoxeur(boxeurData).subscribe(() => {
          this.loadBoxeurs();
          this.resetForm();
        });
      }
    }
  }

  editBoxeur(boxeur: Boxeur): void {
    this.boxeurId = boxeur.id;
    this.isEdit = true;
    this.boxeurForm.patchValue({
      boxeurNom: boxeur.boxeurNom,
      boxeurPrenom: boxeur.boxeurPrenom,
      poids: boxeur.poids,
    });
  }

  deleteBoxeur(boxeurId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce boxeur ?')) {
      this.boxeurService.deleteBoxeur(boxeurId).subscribe(() => {
        this.loadBoxeurs();
      });
    }
  }

  resetForm(): void {
    this.isEdit = false;
    this.boxeurId = undefined;
    this.boxeurForm.reset();
  }
}
