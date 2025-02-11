import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMeetingsComponent } from './all-meetings.component';

describe('AllMeetingsComponent', () => {
  let component: AllMeetingsComponent;
  let fixture: ComponentFixture<AllMeetingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllMeetingsComponent]
    });
    fixture = TestBed.createComponent(AllMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
