export class SaleOrderRegisterModel {
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
  ApprovedFilter: string; //
  IsApproved: boolean;
  DocId: number;
  DocumentTypeId: number;
}
