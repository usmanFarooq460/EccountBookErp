export class productionJobOrderMainModel {
  IsApproved: boolean;
  EndDate: Date;
  EntryDate: Date;
  ModifyDate: Date;
  PlanDate: Date; 
  StartDate: Date;
  ActionId: number;
  DocumentTypeId: number;
  BranchesId: number;
  CompanyId: number;
  EntryUser: number;
  Id: number;
  InvProductionPlantId: number;
  ModifyUser: number;
  OrganizationId: number;
  PlanCode: number; 
  PlanTypeSrNo: number;
  ProjectsId: number;
  RefSalesOrderId: number; // what is ref
  SupplierCustomerId: number; // what
  DeliveryInstructions: string; // DeliveryInstructions
  LotReference: string;
  OtherInstructions: string;
  PackingInstructions: string; // what
  PlanStatus: string;
  PlanType: string; // what
  ProductionInsturction: string; // what
  ProductionType: string; // what
  RefInvoiceNo: string; // what
  WorkInProccessAcId: number;
  FinishGoodsAcId: number;
  ByProductacId: number;
  JobLotId: number; //what
  WipItemId: number;
  FinishGoodRate: number; 
  invProductionJobOrderInput:[];
  invProductionJobOrderOutput:[];
  AttachmentsList:[];
}
