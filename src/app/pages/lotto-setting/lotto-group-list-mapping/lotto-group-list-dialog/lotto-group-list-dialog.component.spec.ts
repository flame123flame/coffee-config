import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoGroupListDialogComponent } from './lotto-group-list-dialog.component';

describe('LottoGroupListDialogComponent', () => {
  let component: LottoGroupListDialogComponent;
  let fixture: ComponentFixture<LottoGroupListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoGroupListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoGroupListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
