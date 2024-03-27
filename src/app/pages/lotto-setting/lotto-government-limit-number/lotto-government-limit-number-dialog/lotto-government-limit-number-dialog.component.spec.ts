import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoGovernmentLimitNumberDialogComponent } from './lotto-government-limit-number-dialog.component';

describe('LottoGovernmentLimitNumberDialogComponent', () => {
  let component: LottoGovernmentLimitNumberDialogComponent;
  let fixture: ComponentFixture<LottoGovernmentLimitNumberDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoGovernmentLimitNumberDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoGovernmentLimitNumberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
