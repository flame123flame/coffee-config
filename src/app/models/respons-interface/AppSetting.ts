export interface AppSettingModel {
  reciveLimit: number;
  reciveLimitType?: any;
  id: number;
  promoCode: string;
  validPeriod: number;
  verificationType?: any;
  depositSequence?: any;
  allowApp: string;
  notAllowTag: string;
  riskOptions?: any;
  violationSetting?: any;
  groupList?: any;
  createdBy: string;
  createdDate: Date;
  updatedBy?: any;
  updatedDate?: any;
  timeGapLimitationEnable: boolean;
  timeGapLimitationValue?: any;
  timeGapLimitationType: string;
  violationCountSetting?: any;
  sameRealName: boolean;
  sameIP: boolean;
}
