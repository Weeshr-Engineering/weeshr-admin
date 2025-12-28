export interface Bank {
  vendorId: string;
  bankName: string;
  bankCode: string;
  accountName: string;
  accountNumber: string;
  recipientCode: string;
  payoutFrequency: 'weekly' | 'daily' | 'daily2' | 'monthly';
  isDefault: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  _id: string;
}

export enum PayoutFrequency {
  DAILY = "daily",
  DAILY2 = "daily2",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}