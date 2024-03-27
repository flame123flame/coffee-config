import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePremissionAddComponent } from './role-premission-add.component';

describe('RolePremissionAddComponent', () => {
  let component: RolePremissionAddComponent;
  let fixture: ComponentFixture<RolePremissionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolePremissionAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolePremissionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
