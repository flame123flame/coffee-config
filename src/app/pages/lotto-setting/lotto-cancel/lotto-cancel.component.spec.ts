import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoCancelComponent } from './lotto-cancel.component';

describe('LottoCancelComponent', () => {
  let component: LottoCancelComponent;
  let fixture: ComponentFixture<LottoCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
