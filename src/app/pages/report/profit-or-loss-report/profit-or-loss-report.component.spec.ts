import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitOrLossReportComponent } from './profit-or-loss-report.component';

describe('ProfitOrLossReportComponent', () => {
  let component: ProfitOrLossReportComponent;
  let fixture: ComponentFixture<ProfitOrLossReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfitOrLossReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitOrLossReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
