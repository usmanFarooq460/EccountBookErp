export class PurchaseInvoiceModel {
  OrganizationId: number;
  CompanyId: number;
  GpSrNoF: number;
  GpSrNoT: number;
  FromDate: Date; //   FromDate
  ToDate: Date; //   ToDate
  FromDocNo: number; //   FromDocNo
  ToDocNo: number; //   ToDocNo
  SupplierCustomerId: number; //   SupplierCustomerId
  ItemId: number; //   ItemId
  reportType: number; //   ReportType
  InventoryParentCateGory: number;
  Crop: string;
}
