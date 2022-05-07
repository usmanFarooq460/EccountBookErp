export class PurchaseInvoiceModel {
  IsApproved: boolean;
  DocDate: Date;
  EntryDate: Date;
  ModifyDate: Date;
  DueDate: Date;
  PostDate: Date;
  SupplierInvoiceDate: Date;
  BillAmount: number;
  CashReceived: number;
  CommAmount: number;
  CommRate: number;
  BranchesId: number;
  FinancialYearId: number;
  CommissionAgentId: number;
  CompanyId: number;
  DocNo: number;
  DocumentTypeId: number;
  DocumentTypeSrNo: number;
  EntryUser: number;
  Id: number;
  ModifyUser: number;
  OrganizationId: number;
  PostUser: number;
  ProjectsId: number;
  ReferencePartyId: number;
  StockPartyId: number;
  SupplierCustomerId: number;
  SupplierInvoiceNo: number;
  SupplierReferenceNo: number;
  DueDays: number;
  CommissionRemarks: string;
  CommissionType: string;
  IsAttachments: string;
  IsTaxable: string;
  ManualBillNo: string;
  OtherRemarks: string;
  RemarksHeader: string;
  UomScheduleIdCmRate: string;
  DeliveryTerm: string;
  PaymentTermsId: number;
  BrokerAgentId: number;
  BrokeryType: string;
  BrokeryRate: number;
  BrokeryUom: number;
  BrokeryAmount: number;
  GpSrNo: number;

  invPurchaseInvoiceDetailList: any;
  InvPurchaseInvoicejournalList: any;
  InvPurchaseInvoiceExpList: any;
  InvPurchaseInvoiceFreightList: any;
  InvPurchaseInvoiceEmptyBagslist:any

  // invPurchaseInvoiceDetailList: any;
  // InvPurchaseInvoicejournalList: any;
  // InvPurchaseInvoiceExpList: any;
  // PaymentDuesSchedules: any;
  // InvPurchaseInvoiceFreightList: any;
  // InvPurchaseInvoiceEmptyBagslist: any;

  // //=======================================================
  // InwardGatePassId: number;
  // CommissionRemarks: string;
  // VehicleNo: string;
  // InvGrnId: number;
  // GpNO: number;
  // OrderDueDays: number;
  // OrderDueDate: Date;
  // StockPartyId: number;
  // SupplierReferenceNo: number;
  // SupplierInvoiceNo: number;
  // FinancialYearId: number;
  // DueDate: Date;
  // DueDays: number;
}

export class PurchaseInvoiceDetailModel {
  GpDate: Date;
  AdLsWeight: number;
  AvgCgsRate: number;
  BillAmount: number;
  CommissionAmount: number;
  EBTotalWt: number;
  EBWeight: number;
  ExpenseAmount: number;
  FreightAmount: number;
  GrossWeight: number;
  ItemAmount: number;
  ItemCgsRate: number;
  ItemQty: number;
  ItemRate: number;
  JournalAmount: number;
  NetBillWeight: number;
  NetStockWeight: number;
  RateCut: number;
  RateCutAmount: number;
  TaxAmount: number;
  TaxPercent: number;
  WeightCut: number;
  WeightCutTotal: number;
  GpNo: number;
  Id: number;
  InvGrnDetailId: number;
  InvGrnId: number;
  InvPurchaseInvoiceId: number;
  ItemId: number;
  ItemUOMId: number;
  JobLotId: number;
  PackingTypeId: number;
  PurchaseOrderId: number;
  TaxNameId: number;
  UomScheduleIdRate: number;
  WarehouseId: number;
  CropYear: string;
  IsTaxable: string;
  LabAnalisysNo: string;
  RemarksDetail: string;
  TaxDescriptions: string;
  VehicleNo: string;
  PurchaseGLAC: number;
  ItemCode: string;
  ItemName: string;
  UOMCodeItem: string;
  WareHouseName: string;
  JobLotDescription: string;
  PackTypeDesc: string;
  PurchaseOrder: number;
  EquivalentPoRate: number;
}

// export class PopupModel {
//   FromDate: Date;
//   ToDate: Date;
//   SupplierCustomerId: number;
//   DocNo: number;
//   DocumentTypeId: number;
//   CompanyId: number;
//   OrganizationId: number;
// }

export class JournalGridModel {
  Id: number;
  InvPurchaseInvoiceId: number;
  ChartofAccountId: number;
  JvRemarks: string;
  JvDebit: number;
  JvCredit: number;
  JvPrcnt: number;
  JvQty: number;
  JvRate: number;
  AccountTitle: string;
}

export class ExpenseGridModel {
  Id: number;
  InvPurchaseInvoiceId: number;
  InvRevExpItemId: number;
  Qty: number;
  Rate: number;
  Amount: number;
  Remarks: string;
}

export class PayblesDebitToItemModel {
  InvPurchaseInvoiceId: number;
  Id: number;
  FrRate: number;
  FrWeight: number;
  FrQty: number;
  FreightAmount: number;
  Debit: number;
  Percentage: number;
  InvGrnId: number;
  TansporterId: number;
  PurchaseOrderId: number;
  Remarks: string;
  //  virtaul
  AccountTitle: string;
}

export class EmptyBagsModel {
  Amount: number;
  PurchaseQty: number;
  ReceivedQty: number;
  Rate: number;
  Id: number;
  InvGrnId: number;
  InvPurchaseInvoiceId: number;
  ItemId: number;
  TypeId: number;
  PurchaseOrderId: number;
  Remarks: string;
  // virtaul
  ItemName: string;
  EmptyBagsType: string;
}