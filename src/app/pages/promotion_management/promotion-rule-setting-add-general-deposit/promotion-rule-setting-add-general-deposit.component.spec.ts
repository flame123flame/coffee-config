import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionRuleSettingAddGeneralDepositComponent } from './promotion-rule-setting-add-general-deposit.component';

describe('PromotionRuleSettingAddGeneralDepositComponent', () => {
  let component: PromotionRuleSettingAddGeneralDepositComponent;
  let fixture: ComponentFixture<PromotionRuleSettingAddGeneralDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionRuleSettingAddGeneralDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionRuleSettingAddGeneralDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
