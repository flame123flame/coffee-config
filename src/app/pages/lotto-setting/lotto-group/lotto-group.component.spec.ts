import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoGroupComponent } from './lotto-group.component';

describe('LottoGroupComponent', () => {
  let component: LottoGroupComponent;
  let fixture: ComponentFixture<LottoGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
