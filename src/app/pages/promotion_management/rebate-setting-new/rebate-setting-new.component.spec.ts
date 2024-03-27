import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RebateSettingNewComponent } from './rebate-setting-new.component';

describe('RebateSettingNewComponent', () => {
  let component: RebateSettingNewComponent;
  let fixture: ComponentFixture<RebateSettingNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RebateSettingNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RebateSettingNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
