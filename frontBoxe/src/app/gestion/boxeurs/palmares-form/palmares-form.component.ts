// src/app/components/palmares-form/palmares-form.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PalmaresService } from '../../../services/palmares.service';
import { Palmares } from '../../../models/palmares.models';
import { BoxeurService } from '../../../services/boxeur.service';
import { CategorieService } from '../../../services/categorie.service';
import { Categorie } from '../../../models/categorie.models';
import { Boxeur } from '../../../models/boxeur.models';

@Component({
  selector: 'app-palmares-form',
  templateUrl: './palmares-form.component.html',
  styleUrls: ['./palmares-form.component.css'],
})
export class PalmaresFormComponent implements OnInit {
  palmaresForm: FormGroup;
  boxeurs: Boxeur[] = [];
  categories: Categorie[] = [];
  isEdit: boolean = false;
  palmaresId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private palmaresService: PalmaresService,
    private boxeurService: BoxeurService,
    private categorieService: CategorieService,
    private route: ActivatedRoute
  ) {
    this.palmaresForm = this.fb.group({
      victoires: [0],
      defaites: [0],
      nul: [0],
      boxeur_id: [null],
      categorie_id: [null],
    });
  }

  ngOnInit(): void {
    this.palmaresId = this.route.snapshot.params['id'];

    // Charger les boxeurs et catégories
    this.boxeurService
      .getAllBoxeurs()
      .subscribe((boxeurs) => (this.boxeurs = boxeurs));
    this.categorieService
      .getAllCategories()
      .subscribe((categories) => (this.categories = categories));

    if (this.palmaresId) {
      this.isEdit = true;
      this.palmaresService
        .getPalmaresById(this.palmaresId)
        .subscribe((palmares: Palmares) => {
          this.palmaresForm.patchValue({
            victoires: palmares.victoires,
            defaites: palmares.defaites,
            nul: palmares.nul,
            boxeur_id: palmares.boxeur.id,
            categorie_id: palmares.categorie.id,
          });
        });
    }
  }

  onSubmit(): void {
    if (this.isEdit) {
      this.palmaresService
        .updatePalmares(this.palmaresId!, this.palmaresForm.value)
        .subscribe();
    } else {
      this.palmaresService.createPalmares(this.palmaresForm.value).subscribe();
    }
  }
}
