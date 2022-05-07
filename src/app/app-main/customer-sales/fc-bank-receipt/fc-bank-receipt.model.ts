export class FcBankReceiptModel {
  Id: number; //   Id
  DocumentNo: number; //   DocumentNo
  DocumentDate: Date; //   DocumentDate
  DocumentTypeId: number; //   DocumentTypeId
  ExmLcPaymentTerm: string; //   ExmLcPaymentTerm
  SupplierCustomerId: number; //   SupplierCustomerId
  ExImLcOrderId: number; //   ExImLcOrderId
  ExImInvoiceId: number; //   ExImInvoiceId
  BankGlDrAc: number; //   BankGlDrAc
  BankFbpNo: string; //   BankFbpNo
  MultiCurrencyId: number; //   MultiCurrencyId
  FcGrossAmount: number; //   FcGrossAmount
  FcFBCharges: number; //   FcFBCharges
  FcNetAmount: number; //   FcNetAmount
  ExchangeRate: number; //   ExchangeRate
  NetAmountRs: number; //   NetAmountRs
  VoucherHeadId: number; //   VoucherHeadId
  IsApproved: boolean; //   IsApproved
  EntryDate: Date; //   EntryDate
  EntryUser: number; //   EntryUser
  ModifyDate: Date; //   ModifyDate
  ModifyUser: number; //   ModifyUser
  PostDate: Date; //   PostDate
  PostUser: number; //   PostUser
  PostState: boolean; //   PostState
  OrganizationId: number; //   OrganizationId
  CompanyId: number; //   CompanyId
  FinancialYearId: number; //   FinancialYearId
  BranchId: number; //   BranchId
  ProjectId: number; //   ProjectId
  BankDrAmount: number; //   BankDrAmount
  Remarks: string; //   Remarks
  InvoiceAmount: number; //   InvoiceAmount
  InvoiceBalanceAmount: number; //InvoiceBalanceAmount
  InvoiceReceivedAmount: number; //InvoiceReceivedAmount
  VoucherExchangeRate: number; //InvoiceReceivedAmount

  FcBankReceiptDetail: any;
}
export class FcBankReceiptDetailModel {
  Id: number; //   Id
  ExImFCBankReceiptsId: number; //   ExImFCBankReceiptsId
  ExImProceedsChargesTypeId: number; //   ExImProceedsChargesTypeId
  FcAmount: number; //   FcAmount
  RsAmount: number; //   RsAmount
  ProceedsChargesTypeCode: string;
  ProceedsRemarks: string; //   ProceedsRemarks
  Type: string; //   ProceedsRemarks
}
export class DataSourceDTOFcBankReceiptDetail {
  Id: number; //   Id
  ExImFCBankReceiptsId: number; //   ExImFCBankReceiptsId
  ExImProceedsChargesTypeId: number; //   ExImProceedsChargesTypeId
  FcAmount: number; //   FcAmount
  RsAmount: number; //   RsAmount
  ProceedsRemarks: string; //   ProceedsRemarks
  ProceedsChargesTypeCode: string;
  Type: string;
}
