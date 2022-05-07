export class invFoodProductionModel {
  DocDate: Date;
  EntryDate: Date;
  ModifyDate: Date;
  ActionId: number;
  BranchId: number;
  DocumentTypeId: number;
  CompanyId: number;
  DocCode: number;
  EntryUser: number;
  Id: number;
  InvFoodProductionPlanId: number; //null
  WIPAccountId: number;
  WIPItemId: number;
  InvJobOrderId: number;
  ModifyUser: number;
  OrganizationId: number;
  ProjectId: number;
  EntryType: string; //Input for input &  Output for Otput entries
  InvJobOrderNo: string; //
  MainRemarks: string;
  RefDocumentTypeId: number; //NULL
  invFoodProductionDetails: any;
}

export class invFoodProductionDetailModel {
  Amount: number;
  Qty: number;
  Rate: number;
  Weight: number;
  Id: number;
  InvFoodProductionId: number; // NULL
  InvProductionJobOrderId: number; //main
  InvProductionJobOrderNo: string; //main
  ItemId: number;
  ItemUomId: number;
  JobLotId: number;
  StockAcId: number; // NULL
  PackingtypeId: number;
  PackUnit: number;
  RateUOMId: number;
  RefDocNoId: number; //loader
  RefDocumentTypeId: number; //loader
  RefDocSubIdNo: number; //??
  VoucherHeadId: number; // null
  WarehouseId: number;
  CropBatch: string;
  EntryType: string; // Issuance
  Remarks: string;

  balanceWeight: number;
  balanceQty: number;
  //////////////////////Virtual
  ItemName: string;
  Equivalent: number; //itemuomid
  JobLotDescription: string;
  PackTypeDesc: string;
  RateUOM: number;
  WareHouseName: string;
  ManualBillNo: string; //null
  DocDate: Date; //??
  DocNo: number; //??
  JobLotCode: string;
  PackTypeCode: string;
  AccountTitle: string; //??
  IssueWeight: number; // net Weight
}
