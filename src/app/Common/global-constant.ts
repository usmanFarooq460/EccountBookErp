// import { PaymentVoucher } from "src/app/app-main/account-transaction/payment-voucher/payment-voucher.model";
import { CompanyInfo } from "../shared/Base/mostUsedMethods";
export class GlobalConstant {
  public static DateFromAcDashboard: Date;
  public static DateToAcDashboard: Date;
  //AccountID
  public static AccountIdAcDashboard: number;
  public static isConnected: boolean;
  public static noInternetConnection: boolean;
  public static checkIfAdminLteIsLoadedOrNot: boolean = true;
  public static CurrentPassword: string;
  //
  public static InventoryDashboardRoutedReportType: string;
  //
  // public static PaymentVoucherHoldedData = new PaymentVoucher();
  public static ScreenRightList = [];
  public static CompanyNameOfLoggedInUser: string;
  public static LastApiCalled: string;
  public static CompanyInfo = new CompanyInfo();
  public static RightsHaveBeenLoadedOnce: boolean = false;
  public static UserRightsData = [];
  public static DecimalSettings: DecimalSettings = {
    PercisionOfAmount: 0,
    PercisionOfRate: 0,
    AmountFormatInGridTotals: "",
    RateFormat: "",
    PercisionOfFcyRate: 0,
    PercisionOfFcyAmount: 0,
    FcyRateFormat: "",
    FcyAmountFormat: "",
    HcyRateFormatInPlainHtml: '',
    HcyAmountFormatInPlainHtml: '',
    FcyRateFormatInPlainHtml:'',
    FcyAmountFormatInPlainHtml:''
  };
  
  public static SetDecimalSettings(RatePercision, AmountPercision, FcyRatePercision, FcyAmountPercision) {
    console.log("SETTING DECIMALS");
    console.log(RatePercision, AmountPercision, FcyRatePercision, FcyAmountPercision)
    //#region Hcy Precisions
    let PercisionOfHcyRate = parseInt(RatePercision>0?RatePercision:0);
    let PercisionOfHcyAmount = parseInt(AmountPercision>0?AmountPercision:0);
    this.DecimalSettings.PercisionOfRate = PercisionOfHcyRate;
    this.DecimalSettings.PercisionOfAmount = PercisionOfHcyAmount;
    this.DecimalSettings.AmountFormatInGridTotals = PercisionOfHcyAmount > 0 ? "#,###." : "#,###";
    this.DecimalSettings.RateFormat = PercisionOfHcyRate > 0 ? "#,###." : "#,###";
    
    for (let i = 0; i < PercisionOfHcyAmount; i++) {
      this.DecimalSettings.AmountFormatInGridTotals += "#";
    }
    for (let i = 0; i < PercisionOfHcyRate; i++) {
      this.DecimalSettings.RateFormat += "#";
    }
    //Managing Account Format
    this.DecimalSettings.AmountFormatInGridTotals += PercisionOfHcyAmount > 0 ? ";(#,###." : ";(#,###";
    for (let i = 0; i < PercisionOfHcyAmount; i++) {
      this.DecimalSettings.AmountFormatInGridTotals += "#";
    }
    this.DecimalSettings.AmountFormatInGridTotals += ")";
    this.DecimalSettings.RateFormat += PercisionOfHcyRate > 0 ? ";(#,###." : ";(#,###";
    for (let i = 0; i < PercisionOfHcyRate; i++) {
      this.DecimalSettings.RateFormat += "#";
    }
    this.DecimalSettings.RateFormat += ")";
    //#endregion
    //#region Fcy Percisions
    let PercisionOfFcyRate = parseInt(FcyRatePercision>0?FcyRatePercision:0);
    let PercisionOfFcyAmount = parseInt(FcyAmountPercision>0?FcyAmountPercision:0);
    this.DecimalSettings.PercisionOfFcyRate = PercisionOfFcyRate;
    this.DecimalSettings.PercisionOfFcyAmount = PercisionOfFcyAmount;
    this.DecimalSettings.FcyRateFormat = PercisionOfFcyRate > 0 ? "#,###." : "#,###";
    for (let i = 0; i < PercisionOfFcyRate; i++) {
      this.DecimalSettings.FcyRateFormat += "#";
    }
    
    this.DecimalSettings.FcyAmountFormat = PercisionOfFcyAmount > 0 ? "#,###." : "#,###";
    for (let i = 0; i < PercisionOfFcyAmount; i++) {
      this.DecimalSettings.FcyAmountFormat += "#";
    }
    // Managing Accounting Format
    this.DecimalSettings.FcyRateFormat += PercisionOfFcyRate > 0 ? ";(#,###." : ";(#,###";
    for (let i = 0; i < PercisionOfFcyRate; i++) {
      this.DecimalSettings.FcyRateFormat += "#";
    }
    this.DecimalSettings.FcyRateFormat += ")";
    this.DecimalSettings.FcyAmountFormat += PercisionOfFcyAmount > 0 ? ";(#,###." : ";(#,###";
    for (let i = 0; i < PercisionOfFcyAmount; i++) {
      this.DecimalSettings.FcyAmountFormat += "#";
    }
    this.DecimalSettings.FcyAmountFormat += ")";
    //#endregion
    //#region Percision For Plain Html
    this.DecimalSettings.HcyRateFormatInPlainHtml='1.'+PercisionOfHcyRate+'-'+PercisionOfHcyRate;
    this.DecimalSettings.HcyAmountFormatInPlainHtml='1.'+PercisionOfHcyAmount+'-'+PercisionOfHcyAmount;
    this.DecimalSettings.FcyRateFormatInPlainHtml='1.'+PercisionOfFcyRate+'-'+PercisionOfFcyRate;
    this.DecimalSettings.FcyAmountFormatInPlainHtml='1.'+PercisionOfFcyAmount+'-'+PercisionOfFcyAmount;
    //#endregion
    console.log(this.DecimalSettings);
  }
}
class DecimalSettings {
  PercisionOfRate: number;
  PercisionOfAmount: number;
  AmountFormatInGridTotals: string;
  RateFormat: string;
  PercisionOfFcyRate: number;
  PercisionOfFcyAmount: number;
  FcyAmountFormat: string;
  FcyRateFormat: string;
  HcyRateFormatInPlainHtml: string;
  HcyAmountFormatInPlainHtml: string;
  FcyRateFormatInPlainHtml: string;
  FcyAmountFormatInPlainHtml: string;
}
