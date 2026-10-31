import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectionDesDonneesComponent } from './protection-des-donnees.component';

describe('ProtectionDesDonneesComponent', () => {
  let component: ProtectionDesDonneesComponent;
  let fixture: ComponentFixture<ProtectionDesDonneesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtectionDesDonneesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProtectionDesDonneesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
