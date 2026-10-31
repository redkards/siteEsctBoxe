import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderProfilComponent } from './slider-profil.component';

describe('SliderProfilComponent', () => {
  let component: SliderProfilComponent;
  let fixture: ComponentFixture<SliderProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderProfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
