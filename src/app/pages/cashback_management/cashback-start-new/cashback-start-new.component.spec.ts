import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashbackStartNewComponent } from './cashback-start-new.component';

describe('CashbackStartNewComponent', () => {
  let component: CashbackStartNewComponent;
  let fixture: ComponentFixture<CashbackStartNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashbackStartNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashbackStartNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
