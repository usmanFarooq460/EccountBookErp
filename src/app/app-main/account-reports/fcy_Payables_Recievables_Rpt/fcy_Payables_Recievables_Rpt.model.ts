export class FcyPayablesRecieablesRptModel {
  FromDate: Date;
  ToDate: Date;
  ProjectsId: number;
  contractId: number;
  BranchesId: number;

  //======================

  ExchangeRateUSD: number;
  ExchangeRateEURO: number;
}
export class DataSourceModel {
  Id: number;
  AccountTitle: string;
  CurrencyCode: string;
  CurrencyRate: number;
  USD_AmountDr: number;
  Euro_AmountDr: number;
  USD_AmountCr: number;
  Euro_AmountCr: number;
  USD_Balance: number;
  Euro_Balance: number;
  PKR_Amount: number;
}
