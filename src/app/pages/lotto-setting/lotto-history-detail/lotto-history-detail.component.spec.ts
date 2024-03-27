import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoHistoryDetailComponent } from './lotto-history-detail.component';

describe('LottoHistoryDetailComponent', () => {
  let component: LottoHistoryDetailComponent;
  let fixture: ComponentFixture<LottoHistoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoHistoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
