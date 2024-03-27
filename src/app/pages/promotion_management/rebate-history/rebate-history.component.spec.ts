import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RebateHistoryComponent } from './rebate-history.component';

describe('RebateHistoryComponent', () => {
  let component: RebateHistoryComponent;
  let fixture: ComponentFixture<RebateHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RebateHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RebateHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
