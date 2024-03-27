import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrsShowSettingComponent } from './prs-show-setting.component';

describe('PrsShowSettingComponent', () => {
  let component: PrsShowSettingComponent;
  let fixture: ComponentFixture<PrsShowSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrsShowSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrsShowSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
