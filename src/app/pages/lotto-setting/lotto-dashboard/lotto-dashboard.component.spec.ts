import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoDashboardComponent } from './lotto-dashboard.component';

describe('LottoDashboardComponent', () => {
  let component: LottoDashboardComponent;
  let fixture: ComponentFixture<LottoDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
