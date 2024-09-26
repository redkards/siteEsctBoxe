import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMsgComponent } from './create-msg.component';

describe('CreateMsgComponent', () => {
  let component: CreateMsgComponent;
  let fixture: ComponentFixture<CreateMsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMsgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
