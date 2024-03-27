import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoStockAddComponent } from './lotto-stock-add.component';

describe('LottoStockAddComponent', () => {
  let component: LottoStockAddComponent;
  let fixture: ComponentFixture<LottoStockAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LottoStockAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoStockAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
