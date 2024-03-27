import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashbackSettingNewAddComponent } from './cashback-setting-new-add.component';

describe('CashbackSettingNewAddComponent', () => {
  let component: CashbackSettingNewAddComponent;
  let fixture: ComponentFixture<CashbackSettingNewAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashbackSettingNewAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashbackSettingNewAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
