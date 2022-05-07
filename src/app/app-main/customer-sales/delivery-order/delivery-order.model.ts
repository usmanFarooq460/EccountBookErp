export class DeliveryOrderModel {
  Id: number;
  DocumentTypeId: number;
  DocNo: number;
  DocDate: Date;
  DoTotalQty: number;
  LoadingInstructions: string;
  IsApproved: boolean;
  EntryDate: Date;
  EntryUser: number;
  ModifyDate: Date;
  ModifyUser: number;
  ApprovedDate: Date;
  ApprovedUser: number;
  OrganizationId: number;
  CompanyId: number;
  BranchesId: number;
  ProjectsId: number;
  DeliveryOrderType: string;
  InvDeliveryOrderDetailList: any;
  // ==================
  GrossWeight: number;
  NetWeight: number;
}
export class DeliveryOrderDetailModel {
  Id: number;
  InvDeliveryOrderId: number;

  SupplierCustomerId: number;
  SaleOrderId: number;
  ItemId: number;
  PackUomId: number;
  InvPackingTypeId: number;
  DoQty: number;
  DoWeight: number;
  LoadingQty: number;
  LoadingWeight: number;
  WarehouseId: number;
  LoadingRemarks: string;
  OrderItemId: number;
  JobLotId: number;

  JobLotDescription: string;
  OrderNo: string;
  SupplierCustomer: string;
  PackUOM: string;
  WarehouseName: string;
  ItemName: string;
  PackTypeDesc: string;

  //======================
  PackingWeight: number;
  GrossWeight: number;
  SaleOrderDetailId: number;

  //==================18-Nov-2021
  CropYearId: number;
  CropYear: string;
  RefDocumentTypeId: number;
  RefDocIdNo: number;
  RefDocSubIdNo: number;
}

export class DataSourceDTO {
  //==================================
  ItemId: number;
  ItemName: string;
  JobLotId: number;
  JobLotDescription: string;
  PackUomId: number;
  PackUOM: string;
  SaleOrderId: number;
  OrderNo: string;
  InvPackingTypeId: number;
  PackTypeDesc: string;
  WarehouseId: number;
  WarehouseName: string;
  SupplierCustomerId: number;
  SupplierCustomer: string;
  DoQty: number;
  DoWeight: number;
  LoadingQty: number;
  LoadingWeight: number;
  LoadingRemarks: string;
  PackingWeight: number;
  GrossWeight: number;
  SaleOrderDetailId: number;

  //==================================18-Nov-2021
  CropYearId: number;
  CropYear: string;
  RefDocumentTypeId: number;
  RefDocIdNo: number;
  RefDocSubIdNo: number;
}

export class DeliveryOrderHeaderArray {
  Id: number;
  DocDate: Date;
  DocNo: number;
  DeliveryOrderType: string;
  DoQty: number;
  DoWeight: number;
  TSaleOrders: number;
  Remarks: string;
}

export class DeliveryOrderDHistoryDetailArray {
  OrderNo: number;
  SupplierCustomer: string;
  ItemName: string;
  DoQty: number;
  DoWeight: number;
  LoadingQty: number;
  LoadingWeight: number;
  PackUOM: number;
  PackTypeDesc: number;
  WareHouseName: string;
}


export class LoaderFormDataModel{
  FromDate:Date;
  ToDate: Date;
  ItemId: number;
  CustomerId: number;
}