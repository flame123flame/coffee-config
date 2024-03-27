import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoStockComponent } from './lotto-stock.component';

describe('LottoStockComponent', () => {
  let component: LottoStockComponent;
  let fixture: ComponentFixture<LottoStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
