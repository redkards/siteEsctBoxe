import { Component, OnInit } from '@angular/core';
import { Palmares } from '../../../models/palmares.models';
import { PalmaresService } from '../../../services/palmares.service';

@Component({
  selector: 'app-palmares',
  standalone: true,
  imports: [],
  templateUrl: './palmares.component.html',
  styleUrl: './palmares.component.css',
})
export class PalmaresComponent implements OnInit {
  palmaresList: Palmares[] = [];

  constructor(private palmaresService: PalmaresService) {}

  ngOnInit(): void {
    this.getPalmares();
  }

  getPalmares(): void {
    this.palmaresService.getAllPalmares().subscribe((data: Palmares[]) => {
      this.palmaresList = data;
    });
  }

  deletePalmares(id: number): void {
    this.palmaresService.deletePalmares(id).subscribe(() => {
      this.getPalmares(); // rafraîchit la liste après suppression
    });
  }
}
