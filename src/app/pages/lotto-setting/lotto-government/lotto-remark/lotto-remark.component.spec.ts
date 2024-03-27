import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoRemarkComponent } from './lotto-remark.component';

describe('LottoRemarkComponent', () => {
  let component: LottoRemarkComponent;
  let fixture: ComponentFixture<LottoRemarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoRemarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
