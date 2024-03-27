import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoConfigAddPrizeComponent } from './lotto-config-add-prize.component';

describe('LottoConfigAddPrizeComponent', () => {
  let component: LottoConfigAddPrizeComponent;
  let fixture: ComponentFixture<LottoConfigAddPrizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoConfigAddPrizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoConfigAddPrizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
