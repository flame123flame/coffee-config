import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoApprovedComponent } from './lotto-approved.component';

describe('LottoApprovedComponent', () => {
  let component: LottoApprovedComponent;
  let fixture: ComponentFixture<LottoApprovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoApprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
