export class SaleOrder {
  Id: number;
  DocumentTypeId: number;
  OrganizationId: number;
  EntryDate: Date;
  EntryUser: number;
  ModifyDate: Date;
  ModifyUser: number;
  PostDate: Date;
  PostState: boolean;
  PostUser: number;
  CompanyId: number;
  BranchesId: number;
  ProjectsId: number;
  DocDate: Date;
  DocNo: number;
  OrderCatagoryId: number;
  CatagorySrNo: number;
  OrderSupCustId: number;
  SupplierRefNo: number;
  RemarksHeader: string;
  PaymentTermsId: number;
  RefrenenceParty: number;
  OrderDueDays: any;
  OrderDueDate: Date;
  OrderExpiryDate: Date;
  DeliveryTerm: string;
  DeliveryStartDate: Date;
  DeliveryDays: number;
  OrderType: string;
  OrderStatus: string;
  //
  BrokerAgentSupCustId: number;
  UomScheduleIdCmRate: number;
  CommAmount: number;
  CommRate: number;
  CommissionRemarks: string;
  CommissionType: string;
  SaleOrderDetailList: any;
}
export class PurchaseOrderDetail {
  Id: number;
  OrderItemId: number;
  OrderItemUOMId: number;
  OrderItemQty: number;
  NetWeight: number;
  OrderItemRate: number;
  OrderItemRateUOMId: number;
  Amount: number;
  JobLotId: number;
  Crop: string;
  OrderRemarks: string;
  TaxNameId: number;

  ItemName: string;
  UOMDescription: string;
  EquivalentRate: string;
  JobLotDescription: string;
  //
  BagPrice: number;
  BagWeight: number;
  LabSampleNo: string;
  Moisture: string;
}
export class DataSourceDTO {
  OrderItemQty: number;
  NetWeight: number;
  OrderItemRate: number;
  Amount: number;
  OrderRemarks: string;
  Crop: string;
  OrderItemId: number;
  ItemName: string;
  OrderItemUOMId: number;

  JobLotId: number;
  JobLotDescription: string;
  OrderItemRateUOMId: number;
  UOMDescription: string;
  EquivalentRate: string;
  BagPrice: number;
  BagWeight: number;
  LabSampleNo: string;
  Moisture: string;
}
