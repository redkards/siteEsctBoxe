import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingNewsComponent } from './floating-news.component';

describe('FloatingNewsComponent', () => {
  let component: FloatingNewsComponent;
  let fixture: ComponentFixture<FloatingNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingNewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
