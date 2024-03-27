export interface GameProviderModel {
    id: number;
    nameTh: string;
    createdAt: Date;
    createdBy: string;
    updatedAt?: any;
    updatedBy?: any;
    nameEn: string;
    code: string;
    statusView: boolean;
    openType: string;
}