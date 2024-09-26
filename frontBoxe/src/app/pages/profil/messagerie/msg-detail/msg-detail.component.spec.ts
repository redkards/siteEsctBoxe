import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgDetailComponent } from './msg-detail.component';

describe('MsgDetailComponent', () => {
  let component: MsgDetailComponent;
  let fixture: ComponentFixture<MsgDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsgDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
