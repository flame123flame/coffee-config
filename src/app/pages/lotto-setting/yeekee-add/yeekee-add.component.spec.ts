import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YeekeeAddComponent } from './yeekee-add.component';

describe('YeekeeAddComponent', () => {
  let component: YeekeeAddComponent;
  let fixture: ComponentFixture<YeekeeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YeekeeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YeekeeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
