// 111 docoment id  for items document id is 14;

export class invFoodProductionPackingTypeModel {
  OrganizationId: number;
  CompanyId: number;
  EntryUser: number;
  ModifyUser: number;
  EntryDate: Date;
  ModifyDate: Date;
  DocDate: Date;
  Amount: number;
  Qty: number;
  Rate: number;
  DocNo: number;
  Id: number;
  InvProductionJobOrderId: number;
  DocumentTypeId: number; //111
  ItemId: number;
  itemUomSchId: number;
  pmRemarks: string;
  UOMDescription: string; //virtual
}
