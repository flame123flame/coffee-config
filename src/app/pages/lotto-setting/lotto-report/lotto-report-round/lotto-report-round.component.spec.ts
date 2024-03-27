import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoReportRoundComponent } from './lotto-report-round.component';

describe('LottoReportRoundComponent', () => {
  let component: LottoReportRoundComponent;
  let fixture: ComponentFixture<LottoReportRoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoReportRoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoReportRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
