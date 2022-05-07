export class DefineItemPricingSchedule {
  Id: number;
  EffectedDate: Date;
  ItemId: number;
  Price: number;
  ItemPriceTypeId: number;
  ScheduleDesc: string;
  UomSchIdPrice: number;

  EntryDate: Date;
  ModifyDate: Date;
  CompanyId: number;
  OrganizationId: number;
  EntryUser: number;
  ModifyUser: number;
}
