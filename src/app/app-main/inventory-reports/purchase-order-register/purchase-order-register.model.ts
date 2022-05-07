export class PurchaseRegisterModel {
  OrganizationId: number; //   Id
  branch: number;
  project: number;
  CompanyId: number; //   DocumentTypeId
  FromDate: Date; //   GpDate
  ToDate: Date; //   GpDate
  FromDocNo: number; //   GatepassType
  ToDocNo: number; //   GpTypeSrNo
  SupplierCustomerId: number; //   SupplierCustomerId
  ItemId: number; //   OtherSupCust
  Status: string; //   VehicleType
  FilterType: string;
  ApprovedFilter: string;
  IsApproved: boolean;
  DocumentTypeId: number;
  InventoryParentCateGory: number;
  dateType: number;
  Crop: string;
  ReportType: number;
}

export class HeaderArrayModelForReportAgainstOutstandingPurchaseOrder {
  RowNumber: number;
  ItemName: string;
  Crop: string;
  MaxRatebyItemCrop: number;
  MinRateByItemCrop: number;
  itemQty: number;
  ItemWeight: number;
  ItemAmount: number;
  ItemAvgRate: number;
}
export class DetailArrayModelForReportAgainstOutstandingPurchaseOrder {
  Supplier: string;
  OrderWeight: number;
  Qty: number;
  ItemSupAmount: number;
  AvgRate: number;
  MaxRatebyItemCropSupplier: number;
  MinRateByItemCropSupplier: number;
}

export class model {
  ItemName: string;
  Supplier: string;
  MaxRatebyItemCropSupplier: number;
  MinRateByItemCrop: number;
  AvgRate: number;
}
