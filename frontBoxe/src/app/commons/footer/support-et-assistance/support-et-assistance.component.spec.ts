import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportEtAssistanceComponent } from './support-et-assistance.component';

describe('SupportEtAssistanceComponent', () => {
  let component: SupportEtAssistanceComponent;
  let fixture: ComponentFixture<SupportEtAssistanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportEtAssistanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportEtAssistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
