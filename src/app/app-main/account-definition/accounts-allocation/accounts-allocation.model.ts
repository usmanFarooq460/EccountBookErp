export class CoaAllocationModel {
  Id: number;
  ChartofAccountId: number;
  CompanyId: number;
  COAAllocationlist: CoaallocationList[];
}
export class CoaallocationList {
  IsActive: boolean;
  ChartofAccountId: number;
  CompanyId: number;
  GLPageNo: string;
}
