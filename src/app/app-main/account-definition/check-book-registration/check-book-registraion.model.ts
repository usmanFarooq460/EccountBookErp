export class checkBookRegistrationModel {
  PostState: boolean;
  DocDate: Date;
  EntryDate: Date;
  ModifyDate: Date;
  PostDate: Date;
  BankId: number;
  ChartOfAccountId: number;
  CompanyId: number; //
  DocNo: number;
  EntryUser: number;
  Id: number;
  ModifyUser: number;
  OrganizationId: number; //
  PostUser: number;
  CbPrefix: string;
  CbSrFrom: string;
  CbSrTo: string;
  Remarks: string;
  ActionId: number;
  Cheqbookdetaillist:Array<checkBookRegistrationDetailModel>;
}
export class checkBookRegistrationDetailModel {
  CheqBookHeaderId: number;
  Id: number;
  CheqNo: string; 
  CheqStatus: string; // Blank
  OtherRemarks: string; // Header remarks
  CheqCancelStatus: Boolean;
}
