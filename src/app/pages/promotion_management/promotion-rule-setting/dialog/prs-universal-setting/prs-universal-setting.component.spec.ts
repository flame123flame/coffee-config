import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrsUniversalSettingComponent } from './prs-universal-setting.component';

describe('PrsUniversalSettingComponent', () => {
  let component: PrsUniversalSettingComponent;
  let fixture: ComponentFixture<PrsUniversalSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrsUniversalSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrsUniversalSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
