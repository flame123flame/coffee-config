import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentTeamListAddComponent } from './agent-team-list-add.component';

describe('AgentTeamListAddComponent', () => {
  let component: AgentTeamListAddComponent;
  let fixture: ComponentFixture<AgentTeamListAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentTeamListAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentTeamListAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
