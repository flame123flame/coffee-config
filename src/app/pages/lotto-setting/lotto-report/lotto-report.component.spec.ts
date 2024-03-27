import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoReportComponent } from './lotto-report.component';

describe('LottoReportComponent', () => {
  let component: LottoReportComponent;
  let fixture: ComponentFixture<LottoReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LottoReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
