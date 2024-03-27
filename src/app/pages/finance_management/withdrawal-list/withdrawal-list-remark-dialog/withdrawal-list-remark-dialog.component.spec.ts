import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalListRemarkDialogComponent } from './withdrawal-list-remark-dialog.component';

describe('WithdrawalListRemarkDialogComponent', () => {
  let component: WithdrawalListRemarkDialogComponent;
  let fixture: ComponentFixture<WithdrawalListRemarkDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawalListRemarkDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalListRemarkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
