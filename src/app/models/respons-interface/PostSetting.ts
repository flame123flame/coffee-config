export interface PostSettingModel {
    id: number;
    promoCode: string;
    promoTitle: string;
    lang: string;
    deskBanner: string;
    deskDetail: string;
    mobileBanner?: any;
    mobileDetail?: any;
    createdBy: string;
    createdDate: Date;
    updatedBy?: any;
    updatedDate?: any;
}