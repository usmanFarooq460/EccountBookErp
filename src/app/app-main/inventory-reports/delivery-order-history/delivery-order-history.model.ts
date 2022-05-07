export class GatePassInwardModel {
  DocumentTypeId: number;
  ItemId: number;
  FromDate: Date; //   FromDate
  ToDate: Date; //   ToDate
  SupplierCustomerId: number; //   SupplierCustomerId
  Status: string; //   Status

  CompanyId: number;
  OrganizationId: number;
  FilterType: string;
  ApprovedFilter: string;
  IsApproved: boolean;
  CompanyAddress: string;
  CompanyName: string;
  ReportName: string;
}
