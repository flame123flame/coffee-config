import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankVerifyComponent } from './bank-verify.component';

describe('BankVerifyComponent', () => {
  let component: BankVerifyComponent;
  let fixture: ComponentFixture<BankVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
