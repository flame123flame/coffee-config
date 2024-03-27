import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoGovernmentCloseNumberComponent } from './lotto-government-close-number.component';

describe('LottoGovernmentCloseNumberComponent', () => {
  let component: LottoGovernmentCloseNumberComponent;
  let fixture: ComponentFixture<LottoGovernmentCloseNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoGovernmentCloseNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoGovernmentCloseNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
