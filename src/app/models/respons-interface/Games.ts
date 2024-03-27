export interface GamesModel {
  id: number;
  nameTh: string;
  createdAt: Date;
  updatedAt?: Date;
  updatedBy: string;
  nameEn: string;
  code: string;
  gameProductTypeCode: string;
  platformMapp?: any;
  platformMhFive?: any;
  platformMini?: any;
  minRtp?: any;
  maxRtp?: any;
  gameTag?: any;
  displayName: string;
  status: boolean;
  remark?: any;
  gameCode: string;
  platformPcDl?: any;
  platformPc?: any;
  enable: boolean;
  providerCode: string;
  image1: string;
  image2: string;
}
