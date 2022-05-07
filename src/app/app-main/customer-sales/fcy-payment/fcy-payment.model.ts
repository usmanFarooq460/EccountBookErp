export class FcyPaymentModel {
  IsApproved: boolean;
  PostState: boolean;
  DocumentDate: Date;
  EntryDate: Date;
  ModifyDate: Date;
  PostDate: Date;
  BankDrAmount: number;
  ExchangeRate: number;
  FcBankChargesAmountRs: number;
  FcFBCharges: number;
  FcGrossAmount: number;
  FcNetAmount: number;
  NetAmountRs: number;
  BankGlDrAc: number;
  BranchId: number;
  CompanyId: number;
  DocumentNo: number;
  DocumentTypeId: number;
  EntryUser: number;
  ExImInvoiceId: number;
  ExImLcOrderId: number;
  FcBankChargesTypeAcId: number;
  FinancialYearId: number;
  Id: number;
  ModifyUser: number;
  MultiCurrencyId: number;
  OrganizationId: number;
  PostUser: number;
  ProjectId: number;
  SupplierCustomerId: number;
  VoucherHeadId: number;
  BankFbpNo: string;
  ExmLcPaymentTerm: string;
  Remarks: string;
  VoucherExchangeRate: number;
  ExImFcBankPaymentsDeductionslst: any;
  //============================
  TotalInvoiceAmount: number;
  TotalPaidAmount: number;
  InvoiceBalanceAmount: number;
  FcyChargesLocalAmount: number;
  HcyChargesLocalAmount: number;
}
export class FcyPaymentDetailModel {
  FcAmount: number;
  RsAmount: number;
  ExImFCBankPaymentsId: number;
  ExImProceedsChargesTypeId: number;
  Id: number;
  ProceedsRemarks: string;
  Type: string;
  ProceedsChargesTypeCode: string;
}

export class ProceedChargesTypeModel {
  EntryDate: Date;
  ModifyDate: Date;
  CompanyId: number;
  EntryUser: number;
  Id: number;
  ModifyUser: number;
  OrganizationId: number;
  ProceedsChargesGlAccount: number;
  ProceedsChargesTypeCode: string;
  ProceedsChargesTypedescription: string;
}
