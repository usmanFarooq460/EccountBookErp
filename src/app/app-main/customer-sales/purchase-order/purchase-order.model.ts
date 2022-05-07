export class PurchaseOrderModel {
  Id: number; //   Id
  DocDate: Date; //   DocDate
  DocumentTypeId: number; //   DocumentTypeId
  DocNo: number; //   DocNo
  SupplierCustomerId: number; //   SupplierCustomerId
  ExImLcOrderId: number; //   ExImLcOrderId
  DocNoByLcOrder: number; //   DocNoByLcOrder
  SupplierOrderNo: string; //   SupplierOrderNo
  SupplierOrderDate: Date; //   SupplierOrderDate
  Containers: number; //   Containers
  FcyId: number; //   FcyId
  RemarksHeader: string; //   RemarksHeader
  LcPoOrderStatus: string; //   LcPoOrderStatus
  OrganizationId: number; //   OrganizationId
  CompanyId: number; //   CompanyId
  BranchesId: number; //   BranchesId
  ProjectsId: number; //   ProjectsId
  EntryUserId: number; //   EntryUserId
  EntryDate: Date; //   EntryDate
  ModifyUserId: number; //   ModifyUserId
  ModifyDate: Date; //   ModifyDate
  IsApproved: boolean; //   IsApproved
  ApprovedDate: Date; //   ApprovedDate
  ApprovedUserId: number; //   ApprovedUserId
  LastShipmentDate: Date; //   LastShipmentDate
  ExpiryDate: Date; //   ExpiryDate
  SupplierInvoiceNo: string; //   SupplierInvoiceNo
  SupplierInvoiceDate: Date; //   SupplierInvoiceDate
  GrossWeight: number; //   GrossWeight
  NetWeight: number; //   NetWeight
  FcyAmount: number; //   FcyAmount
  HomeCurrencyId: number; //   HomeCurrencyId
  ExchangeRate: number; //   ExchangeRate
  Amount: number; //   Amount
  ShippingAgentId: number; //   ShippingAgentId
  ClearingAgentId: number; //   ClearingAgentId
  TransporterId: number; //   TransporterId
  BillOfLadingNo: string; //   BillOfLadingNo
  BillOfLadingDate: Date; //   BillOfLadingDate
  TransitDays: number; //   TransitDays
  ArrivalDate: Date; //   ArrivalDate
  Vessel: string; //   Vessel
  VoyageNo: string; //   VoyageNo
  ETADate: Date; //   ETADate
  ETDDate: Date; //   ETDDate
  ImPurchaseOrderPackingDetailslst: any;
  //==================================
  DeliveryTermId: number;
  LoadingPortId: number;
  DestinationPortId: number;
  ImporterBankId: number;
  ExporterBankId: number;
  PaymentTermId: number;
  //
  // FcurrencyId: number;
  // FCurrencyAmount: number;
  SpecialInstructions: string;
  CommodityDetails: string;
  Mton: number;
}
export class PurchaseOrderDetailModel {
          GrossWeight : number;
          ItemAmount : number
          ItemRate : number;
          NetWeight : number;
          NoOfPacks : number
          PackingWeight : number
          Qty : number
          HomeCurrencyAmount : number;
          ExImLcOrderPurchaseOrderId : number;
          Id : number;
          ItemId : number;
          ItemUomId : number;
          PackingTypeId : number;
          RateUomId : number;
          RemarksDetail : number;
           ItemName : string
           PackingType : String
           RateUom : string;
           ItemUOM : string
}