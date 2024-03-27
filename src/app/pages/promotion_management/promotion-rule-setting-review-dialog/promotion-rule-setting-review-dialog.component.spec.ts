import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionRuleSettingReviewDialogComponent } from './promotion-rule-setting-review-dialog.component';

describe('PromotionRuleSettingReviewDialogComponent', () => {
  let component: PromotionRuleSettingReviewDialogComponent;
  let fixture: ComponentFixture<PromotionRuleSettingReviewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionRuleSettingReviewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionRuleSettingReviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
