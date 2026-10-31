import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoxeurComponent } from './boxeurs.component';

describe('BoxeursComponent', () => {
  let component: BoxeurComponent;
  let fixture: ComponentFixture<BoxeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxeurComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoxeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
