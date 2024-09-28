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
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './boxeurs.component.html',
  styleUrl: './boxeurs.component.css',
})
export class BoxeurComponent implements OnInit {
  boxeurs: Boxeur[] = [];
  boxeurForm: FormGroup;
  isEdit: boolean = false;
  boxeurId: number | undefined; // Change ici

  constructor(private fb: FormBuilder, private boxeurService: BoxeurService) {
    this.boxeurForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      poids: [0, [Validators.required, Validators.min(0)]],
      dateNaissance: [null, Validators.required],
      victoires: [0, Validators.min(0)],
      defaites: [0, Validators.min(0)],
      nuls: [0, Validators.min(0)],
    });
  }

  ngOnInit(): void {
    this.loadBoxeurs();
  }

  loadBoxeurs(): void {
    this.boxeurService.getAllBoxeurs().subscribe((boxeurs) => {
      this.boxeurs = boxeurs;
    });
  }

  onSubmit(): void {
    if (this.boxeurForm.valid) {
      if (this.isEdit && this.boxeurId !== undefined) {
        // Changement ici
        this.boxeurService
          .updateBoxeur(this.boxeurId, this.boxeurForm.value)
          .subscribe(() => {
            this.loadBoxeurs();
            this.resetForm();
          });
      } else {
        this.boxeurService.createBoxeur(this.boxeurForm.value).subscribe(() => {
          this.loadBoxeurs();
          this.resetForm();
        });
      }
    }
  }

  editBoxeur(boxeur: Boxeur): void {
    this.boxeurId = boxeur.id;
    this.isEdit = true;
    this.boxeurForm.patchValue({ ...boxeur });
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
    this.boxeurId = undefined; // Change ici
    this.boxeurForm.reset();
  }
}
