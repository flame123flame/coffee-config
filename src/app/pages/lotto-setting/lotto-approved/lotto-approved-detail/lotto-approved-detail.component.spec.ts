import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoApprovedDetailComponent } from './lotto-approved-detail.component';

describe('LottoApprovedDetailComponent', () => {
  let component: LottoApprovedDetailComponent;
  let fixture: ComponentFixture<LottoApprovedDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoApprovedDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoApprovedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
