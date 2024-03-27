import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoConfigDialogConfirmComponent } from './lotto-config-dialog-confirm.component';

describe('LottoConfigDialogConfirmComponent', () => {
  let component: LottoConfigDialogConfirmComponent;
  let fixture: ComponentFixture<LottoConfigDialogConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoConfigDialogConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoConfigDialogConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
