import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YeekeeApproveComponent } from './yeekee-approve.component';

describe('YeekeeApproveComponent', () => {
  let component: YeekeeApproveComponent;
  let fixture: ComponentFixture<YeekeeApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YeekeeApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YeekeeApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
