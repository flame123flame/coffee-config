import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashbackSettingDetailComponent } from './cashback-setting-detail.component';

describe('CashbackSettingDetailComponent', () => {
  let component: CashbackSettingDetailComponent;
  let fixture: ComponentFixture<CashbackSettingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashbackSettingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashbackSettingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
