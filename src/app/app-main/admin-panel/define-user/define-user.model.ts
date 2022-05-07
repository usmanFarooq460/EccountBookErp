export class DefineUserModel {
  ID: number; //   ID
  UserName: string; //   UserName
  Password: string; //   Password
  IsActive: boolean; //   IsActive
  UserRoleId: number; //   UserRoleId
  UserGroupId: number; //   UserGroupId
  FirstName: string; //   FirstName
  LastName: string; //   LastName
  OrganizationId: number; //   OrganizationId
  CompanyId: number; //   CompanyId
  AuthenticationCode: number; //   AuthenticationCode
  CellNo: string; //   CellNo
  AuthenticationEnabled: boolean; //   AuthenticationEnabled
  BranchesId: number; //   BranchesId
  EntryUserId: number;
  EntryDate: Date;
  ModifyUserId: number;
  ModifyDate: Date;
  UserAccountAllocationsList: any;
}

export class UserAccountAllocationsList {
  Id: number;
  BranchId: number;
  CompanyId: number;
  OrganizationId: number;
  IsActive: boolean;
  EntryDate: Date;
  ModifyDate: Date;
  EntryUserId: number;
  ModifyUserId: number;
  UserAccountId: number;
}
