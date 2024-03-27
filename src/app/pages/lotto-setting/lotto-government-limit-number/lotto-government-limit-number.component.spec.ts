import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoGovernmentLimitNumberComponent } from './lotto-government-limit-number.component';

describe('LottoGovernmentLimitNumberComponent', () => {
  let component: LottoGovernmentLimitNumberComponent;
  let fixture: ComponentFixture<LottoGovernmentLimitNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoGovernmentLimitNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoGovernmentLimitNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
