export class weighBridgeHistoryModel {
  OrganizationId: number; //   Id
  branch: number;
  project: number;
  CompanyId: number; //   DocumentTypeId
  FromDate: Date; //   GpDate
  ToDate: Date; //   GpDate
  FromDocNo: number; //   GatepassType
  ToDocNo: number; //   GpTypeSrNo
  GpSrNoF: number; //   GatepassType
  GpSrNoT: number; //   GpTypeSrNo
  CompanyName: string;
  SupplierCustomerId: number; //   SupplierCustomerId
  ItemId: number; //   OtherSupCust
  Status: string; //   VehicleType
  FilterType: string;
  ApprovedFilter: string; //   VehicleNo
  IsApproved: boolean; //   VehicleNo
  DocId: number;
}
