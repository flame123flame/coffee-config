import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashbackSettingNewAddDialogComponent } from './cashback-setting-new-add-dialog.component';

describe('CashbackSettingNewAddDialogComponent', () => {
  let component: CashbackSettingNewAddDialogComponent;
  let fixture: ComponentFixture<CashbackSettingNewAddDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashbackSettingNewAddDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashbackSettingNewAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
