import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoGovernmentCloseNumberDialogComponent } from './lotto-government-close-number-dialog.component';

describe('LottoGovernmentCloseNumberDialogComponent', () => {
  let component: LottoGovernmentCloseNumberDialogComponent;
  let fixture: ComponentFixture<LottoGovernmentCloseNumberDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoGovernmentCloseNumberDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoGovernmentCloseNumberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
