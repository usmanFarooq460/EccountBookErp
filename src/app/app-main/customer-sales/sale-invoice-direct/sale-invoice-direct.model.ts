export class SaleInvoiceDirectMainModel {
  Id: number; //   Id
  DocumentTypeId: number; //   DocumentTypeId
  DocNo: number; //   DocNo
  DocDate: Date; //   DocDate
  SupplierCustomerId: number; //   SupplierCustomerId
  SupplierReferenceNo: number; //   SupplierReferenceNo
  ManualBillNo: string; //   ManualBillNo
  CommissionAgentId: number; //   CommissionAgentId
  CommissionType: string; //   CommissionType
  CommRate: number; //   CommRate
  UomScheduleIdCmRate: number; //   UomScheduleIdCmRate
  CommAmount: number; //   CommAmount
  CommissionRemarks: string; //   CommissionRemarks
  RemarksHeader: string; //   RemarksHeader
  IsAttachments: string; //   IsAttachments
  IsApproved: boolean; //   IsApproved
  EntryDate: Date; //   EntryDate
  EntryUser: number; //   EntryUser
  ModifyDate: Date; //   ModifyDate
  ModifyUser: number; //   ModifyUser
  PostDate: Date; //   PostDate
  PostUser: number; //   PostUser
  OrganizationId: number; //   OrganizationId
  CompanyId: number; //   CompanyId
  BranchesId: number; //   BranchesId
  ProjectsId: number; //   ProjectsId
  BillAmount: number; //   BillAmount
  FinancialYearId: number; //   FinancialYearId
  //=============================================
  DocumentTypeSrNo: number; //   DocumentTypeSrNo
  SupplierInvoiceDate: Date; //   SupplierInvoiceDate
  SupplierInvoiceNo: number; //   SupplierInvoiceNo
  StockPartyId: number; //   StockPartyId
  ReferencePartyId: number; //   ReferencePartyId
  CashReceived: number; //   CashReceived
  OtherRemarks: string; //   OtherRemarks
  IsTaxable: string; //   IsTaxable
  //=============================================
  InvSaleInvoiceDetaillist: any;
  InvSaleInvoiceJournalList: any;
  InvSaleInvoiceExpenseList: any;
  PaymentDuesSchedules: any;
  InvSaleInvoiceFreightList: any;
}
export class SaleInvoiceDirectDetailModel {
  Id: number; //   Id
  InvSaleInvoiceId: number; //   InvSaleInvoiceId
  InvGdnId: number; //   InvGdnId
  InvGdnDetailId: number; //   InvGdnDetailId

  SaleOrderId: number; //   SaleOrderId

  ItemId: number; //   ItemId
  PackingTypeId: number; //   PackingTypeId

  CropYear: string; //   CropYear
  JobLotId: number; //   JobLotId
  ItemQty: number; //   ItemQty
  ItemUOMId: number; //   ItemUOMId
  GrossWeight: number; //   GrossWeight
  EBWeight: number; //   EBWeight
  EBTotalWt: number; //   EBTotalWt
  AdLsWeight: number; //   AdLsWeight
  NetBillWeight: number; //   NetBillWeight
  NetStockWeight: number; //   NetStockWeight
  ItemRate: number; //   ItemRate
  UomScheduleIdRate: number; //   UomScheduleIdRate
  ItemAmount: number; //   ItemAmount
  WarehouseId: number; //   WarehouseId
  LabAnalisysNo: string; //   LabAnalisysNo
  GpDate: Date; //   GpDate
  RateCut: number; //   RateCut
  RateCutAmount: number; //   RateCutAmount
  WeightCut: number; //   WeightCut
  WeightCutTotal: number; //   WeightCutTotal
  GpNo: number; //   GpNo
  VehicleNo: string; //   VehicleNo
  //=============================================
  IsTaxable: string; //   IsTaxable
  TaxNameId: number; //   TaxNameId
  TaxPercent: number; //   TaxPercent
  TaxDescriptions: string; //   TaxDescriptions
  TaxAmount: number; //   TaxAmount
  //============
  ItemCgsRate: number; //   ItemCgsRate
  AvgCgsRate: number; //   AvgCgsRate
  RemarksDetail: string; //   RemarksDetail
  BillAmount: number; //   BillAmount
  FreightAmount: number; //   FreightAmount
  ExpenseAmount: number; //   ExpenseAmount
  JournalAmount: number; //   JournalAmount
  CommissionAmount: number; //   CommissionAmount
  RefRefDocumentTypeId: number; //   RefRefDocumentTypeId
  RefRefDocIdNo: number; //   RefRefDocIdNo
  RefDocSubId: number; //   RefDocSubId
  SaleOrderDetailId: number; //   SaleOrderDetailId
  //============
  //=============================================
  SaleGLAC: string;
  ItemCode: string;
  ItemName: string;
  UOMCodeItem: string;
  JobLotDescription: string;
  PackTypeDesc: string;
  WareHouseName: string;
  DcNo: number;
  SaleOrder: number;
  RateUOM: string;
}
export class SaleInvoiceDirectExpenseModel {
  Id: number; //   Id
  InvSaleInvoiceId: number; //   InvSaleInvoiceId
  InvRevExpItemId: number; //   InvRevExpItemId
  Qty: number; //   Qty
  Rate: number; //   Rate
  Amount: number; //   Amount
  Remarks: string; //   Remarks
}
export class SaleInvoiceDirectFreightModel {
  Id: number; //   Id
  InvSaleInvoiceId: number; //   InvSaleInvoiceId
  InvGdnId: number; //   InvGdnId
  FrQty: number; //   FrQty
  FrWeight: number; //   FrWeight
  FrRate: number; //   FrRate
  FreightAmount: number; //   FreightAmount
  Debit: number; //   Debit
  TansporterId: number; //   TansporterId
}
export class SaleInvoiceDirectJournalModel {
  Id: number; //   Id
  InvSaleInvoiceId: number; //   InvSaleInvoiceId
  ChartofAccountId: number; //   ChartofAccountId
  JvRemarks: string; //   JvRemarks
  JvDebit: number; //   JvDebit
  JvCredit: number; //   JvCredit
  JvPrcnt: number; //   JvPrcnt
  JvQty: number; //   JvQty
  JvRate: number; //   JvRate
}

export class SaleOrderLoaderFormModel {
  SupplierCustomerId: number;
  OrderId: number;
}

export class SaleOrderDetailModelInLoader {
  Crop: string;
  Equivalent: number;
  SaleOrderDetailId: number;
  ItemName: string;
  JobLotCode: string;
  JobLotId: number;
  OrderItemId: number;
  OrderItemQty: number;
  OrderItemRate: number;
  OrderItemRateUOMId: number;
  OrderItemUOMId: number;
  RateUOM: number;
  SaleOrderId: number;
  SaleOrderNo: number;
}
