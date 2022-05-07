export class ExportAnalyticsModel {
  ToDate: Date;
  ItemTypeId: number;
  ItemCategoryId: number;
  ItemId: number;
  FromDate: Date;
  LcOrderId: number;
  SupplierCustomerId: number;
  DestinationPortId: number;

  GroupName: string;
  M_Tons: number;
  PercentOfTotalExport: number;
  FcyCode: string;
  AvgFcyPrice: number;
  FcyAmount: number;
  AvgExchangeRate: number;
  PkrAmount: number;
}
