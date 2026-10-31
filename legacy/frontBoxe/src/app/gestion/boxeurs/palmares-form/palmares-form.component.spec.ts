import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalmaresFormComponent } from './palmares-form.component';

describe('PalmaresFormComponent', () => {
  let component: PalmaresFormComponent;
  let fixture: ComponentFixture<PalmaresFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PalmaresFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PalmaresFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
