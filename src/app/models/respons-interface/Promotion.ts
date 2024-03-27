export interface PromotionModel {
    id?: number;
    promoCode: string;
    promoTitle: string;
    promoType: string;
    wallet?: any;
    promoPeriodType: string;
    startDate: Date;
    endDate: Date;
    updatedBy?: any;
    updatedDate?: any;
    viewStatus: string;
    deleteAble?: boolean;
    appPlatform: string;

    receiveBonusWallet?: string
}