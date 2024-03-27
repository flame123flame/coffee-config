import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoGroupAddEditComponent } from './lotto-group-add-edit.component';

describe('LottoGroupAddEditComponent', () => {
  let component: LottoGroupAddEditComponent;
  let fixture: ComponentFixture<LottoGroupAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoGroupAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoGroupAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
