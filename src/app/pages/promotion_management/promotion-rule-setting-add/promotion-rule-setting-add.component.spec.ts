import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionRuleSettingAddComponent } from './promotion-rule-setting-add.component';

describe('PromotionRuleSettingAddComponent', () => {
  let component: PromotionRuleSettingAddComponent;
  let fixture: ComponentFixture<PromotionRuleSettingAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionRuleSettingAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionRuleSettingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
