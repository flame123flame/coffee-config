/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RebateSettingNewAddDialogComponent } from './rebate-setting-new-add-dialog.component';

describe('RebateSettingNewAddDialogComponent', () => {
  let component: RebateSettingNewAddDialogComponent;
  let fixture: ComponentFixture<RebateSettingNewAddDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RebateSettingNewAddDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RebateSettingNewAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
