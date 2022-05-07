export class FoodProduction {
  Id: number; //   Id
  DocDate: Date; //   Doc Date
  DocCode: number; //   Doc No
  InvJobOrderId: number; //   Job Order Id
  InvJobOrderNo: string; //   Job Order No
  BranchId: number; //   Branch
  ProjectId: number; //   Project
  MainRemarks: string; //   Remarks
}

export class FoodProductionDetail {
  Id: number; //   Id
  InvFoodProductionId: number; //   Production Header Id
  InvProductionJobOrderId: number; //   Job Order Id
  InvProductionJobOrderNo: number; //   Job Order #
  RefDocNoId: number; //   Ref Invoice #
  EntryType: string; //   Entry Type
  WarehouseId: number; //   Warehouse
  ItemId: number; //   Item
  ItemUomId: number; //   UOM
  CropBatch: string; //   Crop
  JobLotId: number; //   Job / Lot
  PackingtypeId: number; //   Packing Type
  Qty: number; //   Qty
  PackUnit: number; //   0
  Weight: number; //   Weight
  Rate: number; //   Rate
  RateUOMId: number; //   Rate / Unit
  Amount: number; //   Amount
  Remarks: string; //   Remarks
  VoucherHeadId: number; //   0
}
