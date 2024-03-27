export interface GameTagModel {
  id?: number;
  code: string;
  nameTh: string;
  nameEn?: any;
  userView: string;
  createdAt: Date;
  updatedAt?: any;
  updatedBy?: string;
  isActive: boolean;
  priority: number;
}
