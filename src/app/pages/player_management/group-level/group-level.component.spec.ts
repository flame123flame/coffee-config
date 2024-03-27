import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupLevelComponent } from './group-level.component';

describe('GroupLevelComponent', () => {
  let component: GroupLevelComponent;
  let fixture: ComponentFixture<GroupLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
