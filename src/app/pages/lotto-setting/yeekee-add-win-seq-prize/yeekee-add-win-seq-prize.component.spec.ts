import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YeekeeAddWinSeqPrizeComponent } from './yeekee-add-win-seq-prize.component';

describe('YeekeeAddWinSeqPrizeComponent', () => {
  let component: YeekeeAddWinSeqPrizeComponent;
  let fixture: ComponentFixture<YeekeeAddWinSeqPrizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YeekeeAddWinSeqPrizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YeekeeAddWinSeqPrizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
