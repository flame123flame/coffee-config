import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YeekeeAddPrizeComponent } from './yeekee-add-prize.component';

describe('YeekeeAddPrizeComponent', () => {
  let component: YeekeeAddPrizeComponent;
  let fixture: ComponentFixture<YeekeeAddPrizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YeekeeAddPrizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YeekeeAddPrizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
