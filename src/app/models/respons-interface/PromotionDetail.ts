import { AppSettingModel } from "./AppSetting";
import { PostSettingModel } from "./PostSetting";
import { RuleSettingModel } from "./RuleSetting";
import { PromotionModel } from "./Promotion";

export interface PromotionDetailModel {
    promotion: PromotionModel;
    postSetting: PostSettingModel;
    appSetting: AppSettingModel;
    ruleSetting: RuleSettingModel;
    issueSetting: any[];
    bonusLevelSettings: any[];
}