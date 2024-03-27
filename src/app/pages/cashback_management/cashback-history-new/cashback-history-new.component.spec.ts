import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashbackHistoryNewComponent } from './cashback-history-new.component';

describe('CashbackHistoryNewComponent', () => {
  let component: CashbackHistoryNewComponent;
  let fixture: ComponentFixture<CashbackHistoryNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashbackHistoryNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashbackHistoryNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
