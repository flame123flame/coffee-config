import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmReAssignLevelComponent } from './confirm-re-assign-level.component';

describe('ConfirmReAssignLevelComponent', () => {
  let component: ConfirmReAssignLevelComponent;
  let fixture: ComponentFixture<ConfirmReAssignLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmReAssignLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmReAssignLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
