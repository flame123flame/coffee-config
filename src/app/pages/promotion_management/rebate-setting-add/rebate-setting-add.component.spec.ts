import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RebateSettingAddComponent } from './rebate-setting-add.component';

describe('RebateSettingAddComponent', () => {
  let component: RebateSettingAddComponent;
  let fixture: ComponentFixture<RebateSettingAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RebateSettingAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RebateSettingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
