import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SliderProfilComponent } from '../../../commons/slider-profil/slider-profil.component';

@Component({
  selector: 'app-modif-profil',
  standalone: true,
  imports: [RouterLink, SliderProfilComponent],
  templateUrl: './modif-profil.component.html',
  styleUrl: './modif-profil.component.css',
})
export class ModifProfilComponent {}
