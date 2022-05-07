export class SampleAnalysisModel {
  IsAccepted: boolean;
  IsApproved: boolean;
  ApprovedDate: Date;
  ApprovedUserId: number;
  ModifyUser: number;
  OrganizationId: number;
  ProjectsId: number;
  ModifyDate: Date;
  BranchesId: number;
  CompanyId: number;
  EntryUser: number;
  DocumentTypeId: number;
  AnalysisPic: string;
  Attachments: string;
  dmsAttachment: any;
  EntryDate: Date;
  CookingPic: string;

  DocDate: Date;
  DocNo: number;
  Id: number;
  InvLabAnalysisGroupId: number;
  InvLabSampleLogRegisterId: number;
  ItemId: number;
  JobLotId: number;
  SupplierCustomerId: number;
  OrderId: number;
  Crop: string;
  InvSampleLogNo: string;
  Remarks: string;
  ReportNo: string;
  SupplierCode: string;
  CommissionAgentId: number;
  SampleStatus: string;
  // virtual
  LabSampleDetail: Array<ProformaInvoiceDetailModel>;
  ItemName: string;
  AnalysisGroupDescription: string;
}

export class ProformaInvoiceDetailModel {
  Id: number;
  InvLabAnalysisItemsId: number;
  InvLabSampleAnalysisHeaderId: number;
  ResultValue: number;
  InvLabAnalysisItems: number;
  AnalysisGroupDescription: string;
  AnalysisParameterDescription: string;
  MinValue: number;
  MaxValue: number;
}
