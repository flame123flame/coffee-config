import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoDraftClassComponent } from './lotto-draft-class.component';

describe('LottoDraftClassComponent', () => {
  let component: LottoDraftClassComponent;
  let fixture: ComponentFixture<LottoDraftClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoDraftClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoDraftClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
