import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupLevelAdjustLevelComponent } from './group-level-adjust-level.component';

describe('GroupLevelAdjustLevelComponent', () => {
  let component: GroupLevelAdjustLevelComponent;
  let fixture: ComponentFixture<GroupLevelAdjustLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupLevelAdjustLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupLevelAdjustLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
