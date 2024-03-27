import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YeekeeApproveDetailComponent } from './yeekee-approve-detail.component';

describe('YeekeeApproveDetailComponent', () => {
  let component: YeekeeApproveDetailComponent;
  let fixture: ComponentFixture<YeekeeApproveDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YeekeeApproveDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YeekeeApproveDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
