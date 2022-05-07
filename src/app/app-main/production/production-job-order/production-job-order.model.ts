export class ProductionJobOrderModel {
  IsApproved: boolean;
  EndDate: Date;
  EntryDate: Date;
  ModifyDate: Date;
  PlanDate: Date;
  StartDate: Date;
  ActionId: number;
  DocumentTypeId: number;
  BranchesId: number;
  CompanyId: number;
  EntryUser: number;
  Id: number;
  InvProductionPlantId: number;
  ModifyUser: number;
  OrganizationId: number;
  ProjectsId: number;
  PlanCode: number;
  PlanTypeSrNo: number;
  RefSalesOrderId: number;
  SupplierCustomerId: number;
  DeliveryInstructions: string;
  LotReference: string;
  OtherInstructions: string;
  PackingInstructions: string;
  PlanStatus: string;
  PlanType: string;
  ProductionInsturction: string;
  ProductionType: string;
  RefInvoiceNo: string;
  WorkInProccessAcId: number;
  FinishGoodsAcId: number;
  ByProductacId: number;
  JobLotId: number;
  WipItemId: number;
  invProductionJobOrderInput: any;
  invProductionJobOrderOutput: any;
  AttachmentsList: any;
}
export class ProductionJobOrderInputModel {
  NetWeight: number;
  Qty: number;
  Id: number;
  InvProductionJobOrderId: number;
  ItemId: number;
  JobLotId: number;
  UomSchIdQty: number;
  WarehouseId: number;
  BatchCrop: string;
  RemarksInputDt: string;
  ItemName: string;
  JobLotCode: number;
  UOMCode: number;
  WareHouseName: string;
  PackingType: string;
  PackingTypeId: number;
  CropYearId: number;
}

export class ProductionJobOrderOutputModel {
  NetWeight: number;
  QtyInner: number;
  QtyOuter: number;
  Id: number;
  InvPackingTypeId: number;
  InvProductionJobOrderId: number;
  ItemId: number;
  UomSchIdInner: number;
  UomSchIdOuter: number;
  PackRemarks: string;
  PackTypeCode: string;
  PackTypeDesc: string;
  InnerUomCode: string;
  InnerUOMDescription: string;
  outerUOMCode: string;
  OuterUOMDescription: string;
  ItemName: string;
  JobLotId: number;
  CropYearId: number;
  WarehouseId: number;
  CropYear: string;
  WareHouseName: string;
  JobLotDescription: string;
}
export class FilterModel {
  EntryType: string;
  filterType: string;
  filterResutl: number;
}
