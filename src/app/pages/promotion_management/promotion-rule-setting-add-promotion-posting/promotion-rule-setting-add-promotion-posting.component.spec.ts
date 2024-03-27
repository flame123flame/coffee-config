import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionRuleSettingAddPromotionPostingComponent } from './promotion-rule-setting-add-promotion-posting.component';

describe('PromotionRuleSettingAddPromotionPostingComponent', () => {
  let component: PromotionRuleSettingAddPromotionPostingComponent;
  let fixture: ComponentFixture<PromotionRuleSettingAddPromotionPostingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionRuleSettingAddPromotionPostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionRuleSettingAddPromotionPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
