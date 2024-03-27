export interface RuleSettingModel {
  id: number;
  promoCode: string;
  bonusType: string;
  conditionType: string;
  singleBonusLimit?: any;
  maxApprovalLimit: number;
  maxBonusLimit: number;
  depositAmount?: any;
  bonusCalculation: number;
  withdrawCondition: number;
  createdBy: string;
  createdDate: Date;
  updatedBy?: any;
  updatedDate?: any;
  removeGeneral: string;
  amountLimitType: string;
  amountLimit?: any;
  receiveBonusWallet: string;
  maxWithdraw: number;
}
