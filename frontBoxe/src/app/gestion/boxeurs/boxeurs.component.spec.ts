import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxeursComponent } from './boxeurs.component';

describe('BoxeursComponent', () => {
  let component: BoxeursComponent;
  let fixture: ComponentFixture<BoxeursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxeursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxeursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
