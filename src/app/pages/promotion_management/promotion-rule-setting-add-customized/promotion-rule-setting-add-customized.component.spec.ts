import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionRuleSettingAddCustomizedComponent } from './promotion-rule-setting-add-customized.component';

describe('PromotionRuleSettingAddCustomizedComponent', () => {
  let component: PromotionRuleSettingAddCustomizedComponent;
  let fixture: ComponentFixture<PromotionRuleSettingAddCustomizedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionRuleSettingAddCustomizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionRuleSettingAddCustomizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
