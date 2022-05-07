export class GoodsDispatchNotesModel {
  Id: number; //   Id
  DocumentTypeId: number; //   DocumentTypeId
  DocDate: Date; //   DocDate
  DocNo: number; //   DocNo
  SupplierCustomerId: number; //   SupplierCustomerId
  GpNo: number; //   GpNo
  ReferencePartyId: number; //   ReferencePartyId
  StockPartyId: number; //   StockPartyId
  SupplierReference: string; //   SupplierReference
  ReferenceDocNo: string; //   ReferenceDocNo
  PartyWeight: number; //   PartyWeight
  FactoryWeight: number; //   FactoryWeight
  VehicleType: string; //   VehicleType
  VehicleNo: string; //   VehicleNo
  BiltyNo: string; //   BiltyNo
  TransporterDocRef: string; //   TransporterDocRef
  TransporterId: number; //   TransporterId
  CarriageAmount: number; //   CarriageAmount
  OtherCharges: number; //   OtherCharges
  RemarksHeader: string; //   RemarksHeader
  IsApproved: boolean; //   IsApproved
  EntryDate: Date; //   EntryDate
  EntryUser: number; //   EntryUser
  ModifyDate: Date; //   ModifyDate
  ModifyUser: number; //   ModifyUser
  PostDate: Date; //   PostDate
  PostUser: number; //   PostUser
  OrganizationId: number; //   OrganizationId
  CompanyId: number; //   CompanyId
  BranchesId: number; //   BranchesId
  ProjectsId: number; //   ProjectsId
  OutwardGatePassId: number; //   InwardGatePassId
  ActionId: number; //   ActionId;
  //

  Container: string; //   Container
  Container1: string; //   Container1
  DiffWeight: number; //   ActionId
  invGdnDetail: any;
  DeliveryTerm: string;
  PendingParties: number;
  GatepassType: string;
  OrderType: string;
  BalanceWeight: number;
  SupplierWeight: number;

  //========================
  NoOfPackages: number;
  ContainerNo: string;
  ContainerNo1: string;
  //
  OtherSupCust: string;
}
export class GoodsDispatchNoteDetail {
  Id: number; //   Id
  InvGrnId: number; //   InvGrnId
  SaleOrderId: number; //   PurchaseOrderId
  ItemId: number; //   ItemId
  PackingTypeId: number; //   PackingTypeId
  CropYear: string; //   CropYear
  JobLotId: number; //   JobLotId
  ItemQty: number; //   ItemQty
  ItemUomId: number; //   ItemUomId
  GrossWeight: number; //   GrossWeight
  EBWPerUnit: number; //   EBWPerUnit
  EBWTotal: number; //   EBWTotal
  WtCut: number; //   WtCut
  WtCutTotal: number; //   WtCutTotal
  AdLsWeight: number; //   AdLsWeight
  NetBillWeight: number; //   NetBillWeight
  StockWeight: number; //   StockWeight
  WarehouseId: number; //   WarehouseId
  LabReportRef: string; //   LabReportRef
  AreaCity: string; //   AreaCity
  CommentsDetail: string; //   CommentsDetail
  SupplySchedulId: number; //   SupplySchedulId
  GatePassInwarDetailId: number; //   GatePassInwarDetailId
  //

  ContainerNo: string;
  SaleOrderNo: number;
  PurchaseOrder: number;
  Item: string;
  UOMEquivalent: number;
  PackingType: string;
  JobLot: string;
  WareHouseCode: string;

  //==============================19-Nov-2021
  RefDocumentTypeId: number;
  RefDocIdNo: number;
  RefDocSubIdNo: number;
}
export class DataSourceDTO {
  SaleOrderId: number;
  SaleOrderNo: number; //   PurchaseOrderId
  ItemId: number; //   ItemId
  PackingTypeId: number; //   PackingTypeId
  //   CropYear
  JobLotId: number; //   JobLotId
  ItemQty: number; //   ItemQty
  ItemUomId: number; //   ItemUomId
  GrossWeight: number; //   GrossWeight
  EBWPerUnit: number; //   EBWPerUnit
  EBWTotal: number; //   EBWTotal
  WtCut: number; //   WtCut
  WtCutTotal: number; //   WtCutTotal
  AdLsWeight: number; //   AdLsWeight
  NetBillWeight: number; //   NetBillWeight
  StockWeight: number; //   StockWeight

  LabReportRef: string; //   LabReportRef
  AreaCity: string; //   AreaCity

  //
  ContainerNo: string;

  Item: string;
  UOMEquivalent: number;
  PackingType: string;
  JobLot: string;
  WarehouseId: number; //   WarehouseId
  CropYear: string;
  //==============================19-Nov-2021
  RefDocumentTypeId: number;
  RefDocIdNo: number;
  RefDocSubIdNo: number;
}
