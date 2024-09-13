import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionsGeneralesDutilisationComponent } from './conditions-generales-dutilisation.component';

describe('ConditionsGeneralesDutilisationComponent', () => {
  let component: ConditionsGeneralesDutilisationComponent;
  let fixture: ComponentFixture<ConditionsGeneralesDutilisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConditionsGeneralesDutilisationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConditionsGeneralesDutilisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
