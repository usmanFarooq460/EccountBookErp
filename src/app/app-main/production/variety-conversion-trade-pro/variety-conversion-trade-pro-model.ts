export class VarietyConversionTradeProModel {
  Id: number;
  DocTypeId: number;
  DocSrNo: number;
  DocDate: Date;
  ProductionNo: string;
  DocManualRef: string = "";
  Remarks: string;
  EntryDate: Date;
  EntryUser: number;
  ModifyDate: Date;
  ModifyUser: number;
  PostDate: Date = new Date();
  PostUser: number = parseInt(sessionStorage.getItem("UserId"));
  PostState: boolean;
  OrganizationId: number;
  CompanyId: number;
  BranchedId: number;
  ProjectsId: number;
  ActionId: number = 0;
  parentCategoryId: number;
  invStockConversionDetails: any;
  invStockConversionAddExpenses: any;
  invStockConversionPackings: any;

  //==========================@hamzamfaroqi55
}

export class VarietyConversionTradeProDetailModel {
  Id: number;
  InvStockConversionId: number;
  EntryType: string;
  WarehouseId: number;
  ItemId: number;
  ItemUomId: number;
  CropBatch: string = "";
  JobLotId: number;
  PackingtypeId: number = 0;
  Qty: number;
  PackUnit: number;
  Weight: number = 0;
  Rate: number;
  RateUOMId: number;
  Amount: number;
  ProjectId: number;
  VoucherHeadId: number;
  Remarks: string;
  ExpenseAmount: number;
  PackingMaterialAmount: any;
  Stock: number;
  AverageRate: number;
  WareHouseName: string;
  ItemName: string;
  JobLotDescription: string;
  PackTypeDesc: string = " ";
  UOMDescription: string;
  Equivalent: any;
  AmountWithoutExpenses: number;
  // ================
  Moisture: number = 0;
  MoistureSlabId: number = 0;
  MoistureSlabDescription: string = " ";
}

export class StocConversionDetailDataSource {}

export class PackingMaterialModel {
  Id: number;
  InvStockConversionId: number;
  ItemId: number;
  ItemSchUOM: number;
  ItemQty: number;
  ItemRate: number;
  ItemAmount: number;
  ChargeTo: string;
}

export class OverheadModel {
  Id: number;
  InvStockConversionId: number;
  ChartOfAccountId: number; //account head
  LedgerRemarks: string;
  ExpAmount: number; //amount
  ChargeTo: string;
}

export class DummyModelForSummary {
  TotalQuantityForInput: number;

  AverageRateForInput: number;
  TotalAmountForInput: number;

  TotalQuantityForOutput: number;

  AverageRateForOutput: number;
  TotalAmountForOutput: number;

  TotalQuantityForPackingMaterial: number;

  AverageRateForPackingMaterial: number;
  TotalAmountForPackingMaterial: number;

  TotalQuantityFinishGoods: number;

  AverageRateFinishGoods: number;
  TotalAmountFinishGoods: number;

  TotalQuantityForOverHeads: number;

  AverageRateForOverHeads: number;
  TotalAmountForOverHeads: number;

  TotalQuantityForDifference: number;

  AverageRateForDifference: number;
  TotalAmountForDifference: number;
}

export class AvailableTrasactionsForIssuanceModel {}
