import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YeekeeAddDummyUserComponent } from './yeekee-add-dummy-user.component';

describe('YeekeeAddDummyUserComponent', () => {
  let component: YeekeeAddDummyUserComponent;
  let fixture: ComponentFixture<YeekeeAddDummyUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YeekeeAddDummyUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YeekeeAddDummyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
