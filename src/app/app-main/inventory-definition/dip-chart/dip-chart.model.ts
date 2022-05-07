export class DipChartModel {
  Id: number;
  TankId: number;
  ItemId: number;
  ItemUomId: number;
  BooksStock: number;
  DipReadingStock: number;
  StockTakenBy: string;
  Remarks: string;
  EntryDate: Date;
  EntryUser: number;
  ModifyDate: Date;
  ModifyUser: number;
  ApprovedDate: Date;
  IsApproved: boolean;
  ApprovedUser: number;
  OrganizationId: number;
  CompanyId: number;
  BranchesId: number;
  ProjectsId: number;
  Difference: number;
  DocDate: Date;
  DocNo: number;
}
export class DipChartHistoryModel {
  ItemId: number;
  FromDate: Date;
  ToDate: Date;
}
