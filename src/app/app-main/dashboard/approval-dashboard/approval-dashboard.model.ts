export class ApprovalDashboardModel {
  SupplierCustomerId: number;
  FromDate: Date;
  ToDate: Date;
  ItemId: number;
  OrganizationId: number;
  CompanyId: number;
  FilterType: string;
  IsApproved: boolean;
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
  IsApproved: boolean;
}
