export class PreShipmentAnalysisModel {
  Id: number;
  InspectedByLabId: number;
  ReportDate: Date;
  ReportRefNo: number;
  LotRefNo: number;
  ItemId: number;
  QtyKgs: number;
  InspectionRemarks: string;
  OrganizationId: number;
  CompanyId: number;
  BranchesId: number;
  ProjectsId: number;
  EntryUserId: number;
  EntryDate: Date;
  ModifyUserId: number;
  ModifyDate: Date;
  IsApproved: boolean;
  ApprovedUserId: number;
  ApprovedDate: Date;
  LotInspectionDetails: any;
  ProductSpecification: string;
  ConfirmationDate: Date;

  ReportDocNo: number;
  JobLotId: number;
  // virtual:
  JobLotDescription: string;
}
export class PreShipmentAnalysisDetailModel {
  Id: number;
  InvLabPreProductionExportLotInspectionHeaderId: number;
  SupplierCustomerId: number;
  ContractId: number;
  Qty: number;
  SubLot: string;
  SubRemarks: string;
  Status: string;

  SupplierCustomer: string;
  ContractNo: string;
}
export class DataSourceDTO {
  Id: number;
  InvLabPreProductionExportLotInspectionHeaderId: number;
  SupplierCustomerId: number;
  ContractId: number;
  Qty: number;
  SubLot: string;
  SubRemarks: string;
  Status: string;
}
export class PreShipmentAnalysisHistoryFilterCriteriasModel {
  ReportStatus: boolean;
  InspectionStatus: string;
}
