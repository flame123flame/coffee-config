import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashbackPendingNewComponent } from './cashback-pending-new.component';

describe('CashbackPendingNewComponent', () => {
  let component: CashbackPendingNewComponent;
  let fixture: ComponentFixture<CashbackPendingNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashbackPendingNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashbackPendingNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
