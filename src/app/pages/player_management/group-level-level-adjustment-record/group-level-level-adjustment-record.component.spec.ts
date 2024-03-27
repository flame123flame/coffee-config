import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupLevelLevelAdjustmentRecordComponent } from './group-level-level-adjustment-record.component';

describe('GroupLevelLevelAdjustmentRecordComponent', () => {
  let component: GroupLevelLevelAdjustmentRecordComponent;
  let fixture: ComponentFixture<GroupLevelLevelAdjustmentRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupLevelLevelAdjustmentRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupLevelLevelAdjustmentRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
