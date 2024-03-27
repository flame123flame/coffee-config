import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonUpdateComponent } from './button-update.component';

describe('ButtonUpdateComponent', () => {
  let component: ButtonUpdateComponent;
  let fixture: ComponentFixture<ButtonUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
