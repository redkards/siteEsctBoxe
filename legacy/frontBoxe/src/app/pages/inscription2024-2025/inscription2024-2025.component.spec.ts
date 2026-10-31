import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inscription20242025Component } from './inscription2024-2025.component';

describe('Inscription20242025Component', () => {
  let component: Inscription20242025Component;
  let fixture: ComponentFixture<Inscription20242025Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inscription20242025Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Inscription20242025Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
