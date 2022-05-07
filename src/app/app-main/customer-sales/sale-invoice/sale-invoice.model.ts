export class SaleInvoiceModel {
  IsApproved: boolean;
  DocDate: Date;
  EntryDate: Date;
  ModifyDate: Date;
  PostDate: Date;
  SupplierInvoiceDate: Date;
  BillAmount: number;
  CashReceived: number;
  CommAmount: number;
  CommRate: number;
  FreightAmount: number;
  BranchesId: number;
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
  FinancialYearId: number;
  TransporterId: number;
  CommissionRemarks: string;
  CommissionType: string;
  IsAttachments: string;
  IsTaxable: string;
  ManualBillNo: string;
  OtherRemarks: string;
  RemarksHeader: string;
  UomScheduleIdCmRate: number;

  InvSaleInvoiceDetaillist: any;
  InvSaleInvoiceJournalList: any;
  InvSaleInvoiceExpenseList: any;
  InvSaleInvoiceFreightList: any;

  //=======================================================
  OutwardGatePassId: number;
  // CommissionRemarks: string;
  VehicleNo: string;
  InvGdnId: number;
  GpNO: number;
  OrderDueDays: number;
  OrderDueDate: Date;
}

export class SaleInvoiceDetailModel {
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
  InvGdnDetailId: number;
  InvGdnId: number;
  InvSaleInvoiceId: number;
  ItemId: number;
  ItemUOMId: number;
  JobLotId: number;
  PackingTypeId: number;
  SaleOrderId: number;
  SaleOrderDetailId: number;
  TaxNameId: number;
  UomScheduleIdRate: number;
  WarehouseId: number;
  RefRefDocumentTypeId: number;
  RefRefDocIdNo: number;
  RefDocSubId: number;
  LineId: number;

  CropYear: string;
  IsTaxable: string;
  LabAnalisysNo: string;
  RemarksDetail: string;
  TaxDescriptions: string;
  VehicleNo: string;
  //
  SaleGLAC: number;
  ItemCode: string;
  ItemName: string;
  UOMCodeItem: string;
  JobLotDescription: string;
  PackTypeDesc: string;
  WareHouseName: string;
  DcNo: number;
  SaleOrder: number;
  RateUOM: number;
  CarriageAmount: number;

  // BillAmount: number;
  // CommissionAmount: number;
  // EBTotalWt: number;
  // ExpenseAmount: number;
  // ItemAmount: number;
  // ItemQty: number;
  // OrderItemRate: number;

  // ItemRate: number;
  // NetBillWeight: number;
  // StockWeight: number;
  // NetStockWeight: number;
  // RateCut: number;
  // RateCutAmount: number;
  // WeightCutTotal: number;
  // Id: number;
  // InvGrnDetailId: number;
  // InvGdnId: number;
  // InvPurchaseInvoiceId: number;
  // ItemId: number;
  // ItemUOMId: number;
  // ItemUomId: number;
  // JobLotId: number;
  // PackingTypeId: number;
  // SaleOrderId: number;
  // SaleOrder: number;
  // UomScheduleIdRate: number;
  // WarehouseId: number;
  // CropYear: string;
  // ItemCgsRate: number;
  // reshapeOnPush: boolean = true;
  // // reshapeOnPush: boolean=true;
  // InvGdnDetailId: number;
  // EBWTotal: number;
  // EBWeight: number;
  // EBWPerUnit: number;
  // OrderItemRateUOMId: number;
  // EquivalentPoRate: number;
  // //========================22-Nov-2021
  // RefDocumentTypeId: number;
  // RefDocSubIdNo: number;
  // RefDocIdNo: number;
}

export class PopupModel {
  FromDate: Date;
  ToDate: Date;
  SupplierCustomerId: number;
  DocNo: number;
  DocumentTypeId: number;
  CompanyId: number;
  OrganizationId: number;
}

export class JournalGridModel {
  ChartofAccountId: number;
  JvPrcnt: number;
  JvQty: number;
  JvRate: number;
  JvRemarks: string;
  JvDebit: number;
  JvCredit: number;
  JvPercent: number;
  InvSaleInvoiceId: number;
  Id: number;
}

export class PaymentGridModel {
  DueDays: number;
  DueDate: Date;
  DuePercentage: number;
  Amount: number;
}

export class ExpenseGridModel {
  Amount: number;
  Qty: number;
  Rate: number;
  Id: number;
  InvRevExpItemId: number;
  InvSaleInvoiceId: number;
  Remarks: string;
}

export class PayblesDebitToItemModel {
  Debit: number;
  FreightAmount: number;
  FrQty: number;
  FrRate: number;
  FrWeight: number;
  Id: number;
  InvGdnId: number;
  InvSaleInvoiceId: number;
  TansporterId: number;
  // InvGdnId: number;
  // TansporterId: number;
  // FreightAmount: number;
  // Remarks: string;
}

export class EmptyBagsModel {
  InvGdnId: number;
  ItemId: number;
  ItemName: string;
  PurchaseQty: number;
  Rate: number;
  Amount: number;
  Remarks: string;
}
