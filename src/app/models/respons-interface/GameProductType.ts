export interface GameProductTypeModel {
    id: number;
    code: string;
    productCode: string;
    providerCode: string;
    createdAt: Date;
    updatedAt?: Date;
    updatedBy: string;
}