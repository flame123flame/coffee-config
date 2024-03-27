import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashbackSettingNewComponent } from './cashback-setting-new.component';

describe('CashbackSettingNewComponent', () => {
  let component: CashbackSettingNewComponent;
  let fixture: ComponentFixture<CashbackSettingNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashbackSettingNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashbackSettingNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
