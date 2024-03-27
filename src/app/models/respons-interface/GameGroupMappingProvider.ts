export interface GameGroupMappingProviderModel {
    id: number;
    gameGroupCode: string;
    providerCode: string;
    createdAt: Date;
    updatedAt?: Date;
    updatedBy: string;
}