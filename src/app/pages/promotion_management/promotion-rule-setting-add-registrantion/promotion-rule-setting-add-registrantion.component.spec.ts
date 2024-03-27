import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionRuleSettingAddRegistrantionComponent } from './promotion-rule-setting-add-registrantion.component';

describe('PromotionRuleSettingAddRegistrantionComponent', () => {
  let component: PromotionRuleSettingAddRegistrantionComponent;
  let fixture: ComponentFixture<PromotionRuleSettingAddRegistrantionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionRuleSettingAddRegistrantionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionRuleSettingAddRegistrantionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
