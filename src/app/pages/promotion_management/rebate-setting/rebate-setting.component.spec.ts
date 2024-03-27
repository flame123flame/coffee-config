import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RebateSettingComponent } from './rebate-setting.component';

describe('RebateSettingComponent', () => {
  let component: RebateSettingComponent;
  let fixture: ComponentFixture<RebateSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RebateSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RebateSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
