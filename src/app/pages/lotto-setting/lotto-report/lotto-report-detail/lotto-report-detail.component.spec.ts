import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoReportDetailComponent } from './lotto-report-detail.component';

describe('LottoReportDetailComponent', () => {
  let component: LottoReportDetailComponent;
  let fixture: ComponentFixture<LottoReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LottoReportDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
