export interface Bank {
  vendorId: string;
  bankName: string;
  bankCode: string;
  accountName: string;
  accountNumber: string;
  recipientCode: string;
  payoutFrequency: PayoutFrequency;
  isDefault: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  _id: string;
}

export enum PayoutFrequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}