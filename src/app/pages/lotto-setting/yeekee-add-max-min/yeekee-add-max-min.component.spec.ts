import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YeekeeAddMaxMinComponent } from './yeekee-add-max-min.component';

describe('YeekeeAddMaxMinComponent', () => {
  let component: YeekeeAddMaxMinComponent;
  let fixture: ComponentFixture<YeekeeAddMaxMinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YeekeeAddMaxMinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YeekeeAddMaxMinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
