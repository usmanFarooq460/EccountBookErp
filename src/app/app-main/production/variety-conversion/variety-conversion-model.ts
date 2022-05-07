export class VarietyConversionModel {
  Id: number;
  DocTypeId: number;
  DocSrNo: number;
  DocDate: Date;
  ProductionNo: string;
  DocManualRef: string;
  Remarks: string;
  EntryDate: Date;
  EntryUser: number;
  ModifyDate: Date;
  ModifyUser: number;
  PostDate: Date;
  PostUser: number;
  PostState: boolean;
  OrganizationId: number;
  CompanyId: number;
  BranchedId: number;
  ProjectsId: number;
  ActionId: number;
  parentCategoryId: number;
  invStockConversionDetails: any;
  invStockConversionAddExpenses: any;
  invStockConversionPackings: any;

  //==========================@hamzamfaroqi55
}

export class VarietyConversionDetailModel {
  Id: number;
  InvStockConversionId: number;
  EntryType: string;
  WarehouseId: number;
  ItemId: number;
  ItemUomId: number;
  CropBatch: string;
  JobLotId: number;
  PackingtypeId: number;
  Qty: number;
  PackUnit: number;
  Weight: number;
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
  PackTypeDesc: string;
  UOMDescription: string;
  Equivalent: any;
  AmountWithoutExpenses: number;
  //================
  Moisture: number;
  MoistureSlabId: number;
  MoistureSlabDescription: string;
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
  TotalWeightForInput: number;
  AverageRateForInput: number;
  TotalAmountForInput: number;

  TotalQuantityForOutput: number;
  TotalWeightForOutput: number;
  AverageRateForOutput: number;
  TotalAmountForOutput: number;

  TotalQuantityForPackingMaterial: number;
  TotalWeightForPackingMaterial: number;
  AverageRateForPackingMaterial: number;
  TotalAmountForPackingMaterial: number;

  TotalQuantityFinishGoods: number;
  TotalWeightFinishGoods: number;
  AverageRateFinishGoods: number;
  TotalAmountFinishGoods: number;

  TotalQuantityForOverHeads: number;
  TotalWeightForOverHeads: number;
  AverageRateForOverHeads: number;
  TotalAmountForOverHeads: number;

  TotalQuantityForDifference: number;
  TotalWeightForDifference: number;
  AverageRateForDifference: number;
  TotalAmountForDifference: number;
}

export class AvailableTrasactionsForIssuanceModel {}
