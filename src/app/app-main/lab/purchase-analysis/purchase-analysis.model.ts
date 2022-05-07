export class purchaseAnalysisModel {
  IsAccepted: boolean;
  IsApproved: boolean;
  ApprovedDate: Date;
  DocDate: Date;
  EntryDate: Date;
  ModifyDate: Date;
  DeductionRate: number;
  DeductionWeight: number;
  ApprovedUserId: number;
  DocumentTypeId: number;
  BranchesId: number;
  CompanyId: number;
  DocNo: number;
  EntryUser: number;
  GatePassInwardId: number;
  Id: number;
  InvLabAnalysisGroup: number;
  InvLabSampleLogRegisterId: number;
  ItemId: number;
  ModifyUser: number;
  OrganizationId: number;
  ProjectsId: number;
  PurchaseOrderId: number;
  SupplierCustomerId: number;
  AnalystName: string;
  CookingPic: string;
  Crop: string;
  Pic1Pathe: string;
  RemarksHeader: string;
  SupCustCode: string;
  // list
  LabSampleDetail: any;
  dmsAttachment: any;
  // virtual List<InvLabAnalysisPurchaseDetail> LabSampleDetail
  // virtual List<DMSAttachments> dmsAttachment

  // virtaul
  BiltyNo: string;
  SupCustCodePah: string;
  VehicleNo: string;
  GpSrNo: string;
  LabSampleNo: string;
  ItemName: string;
}
export class purchaseInvoiceDetailModel {
  InAnalysisResult: number;
  Id: number;
  InvLabAnalysisPurchaseHeaderId: number;
  InvLabGroupAnalysisStandardsId: number;
  RemarksDetail: string;
  AnalysisParameterDescription: string;
  MinValue: string;
  MaxValue: string;
  ResultValue: string;
}
