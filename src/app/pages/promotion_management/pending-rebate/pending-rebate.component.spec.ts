import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRebateComponent } from './pending-rebate.component';

describe('PendingRebateComponent', () => {
  let component: PendingRebateComponent;
  let fixture: ComponentFixture<PendingRebateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingRebateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingRebateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
