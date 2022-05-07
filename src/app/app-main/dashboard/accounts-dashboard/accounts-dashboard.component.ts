import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { accountsDashboardReportService } from "./chart-of-account.service";
import { Router, RouterLink } from "@angular/router";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { GlobalConstant } from "src/app/Common/global-constant";

@Component({
  selector: "app-accounts-dashboard",
  templateUrl: "./accounts-dashboard.component.html",
  styleUrls: ["./accounts-dashboard.component.scss"],
})
@Injectable({
  providedIn: "root",
})
export class AccountsDashboardComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("DashboardForm", { static: false })
  DashboardForm: DxFormComponent;
  DashboardFormData: any;
  dataSource = [];
  loadStatus: boolean;
  popupDataSource = [];
  dashboardTitle: string;
  ToDate: Date;
  FromDate: Date;
  BankBalanceGroupId: BehaviorSubject<any>;
  ToDatevalueshare: string;
  FromDatedatevalueshare: Date;
  dateList = [
    { Id: 1, name: "Today" },
    { Id: 2, name: "Current Week" },
    { Id: 3, name: "Current Month" },
    { Id: 4, name: "Current Year" },
  ];
  cashBlances;
  bankBalances;
  Payables;
  Receivables;
  TodayBuissness;
  PdcCurrentStock;
  PdcTotalStock;
  EximPayables;
  EximReceivables;
  EximContracts;
  StaffReceivables;

  // By Hamza Muhammad Farooqi

  localSales;
  brandSales;
  exportSales;
  otherSales;
  purchase;
  //CashBalances
  cashTitle;
  cashOpening: any;
  cashClosing: any;
  cashCurrDr: any;
  cashCurrCr: any;
  //BankBalances
  bankTitle;
  bankOpening: any;
  bankClosing: any;
  bankCurrDr: any;
  bankCurrCr: any;
  //Payables
  payableTitle;
  payableOpening: any;
  payableClosing: any;
  payableCurrDr: any;
  payableCurrCr: any;
  //Receivables
  receivablesTitle;
  receivablesOpening: any;
  receivablesClosing: any;
  receivablesCurrDr: any;
  receivablesCurrCr: any;
  //TodayBuissness
  tbTitle;
  tbOpening: any;
  tbClosing: any;
  tbCurrDr: any;
  tbCurrCr: any;

  //PdcCurrentstock
  PdcTitle;
  PdcOpCheqqty: any;
  PdcOpCheqamount: any;
  PdcCurrqty: any;
  PdcCurramount: any;
  PdcClqty: any;
  PdcClamount: any;
  //PdcTotalStock
  PdcTotalTitle;
  PdctotalOpCheqqty: any;
  PdctotalOpCheqamount: any;
  PdctotalCurrqty: any;
  PdctotalCurramount: any;
  PdctotalClqty: any;
  PdctotalClamount: any;

  //Export Payables
  EximPayableTitle;
  EximPayableOpening: any;
  EximPayableClosing: any;
  EximPayableCurrDr: any;
  EximPayableCurrCr: any;
  //Exprot Receiablaces
  EximReceivablesTitle;
  EximReceivablesOpening: any;
  EximReceivablesClosing: any;
  EximReceivablesCurrDr: any;
  EximReceivablesCurrCr: any;
  //Export Contract
  EximContractMTon: any;
  EximContractCntrs: any;
  EximShippedCntrs: any;
  EximShippedMTon: any;
  EximBalanceCntrs: any;
  EximBalanceMton: any;

  accountGroupId: number;
  FinancialYearId: number;

  // DECLARING VARIABLES FOR DEALING WITH NEW DATA BY SIR YASEEN:
  // cashTitle;
  // cashOpening: any;
  // cashClosing: any;
  // cashCurrDr: any;
  // cashCurrCr: any;

  localSalesOpening: any;
  localSalesClosing: any;
  localSalesCurrentCr: any;
  localSalesCurrentDr: any;

  brandSalesOpening: any;
  brandSalesClosing: any;
  brandSalesCurrentCr: any;
  brandSalesCurrentDr: any;

  exportSalesOpening: any;
  exportSalesClosing: any;
  exportSalesCurrentCr: any;
  exportSalesCurrentDr: any;

  otherSalesOpening: any;
  otherSalesClosing: any;
  otherSalesCurrentCr: any;
  otherSalesCurrentDr: any;

  PurchaseOpening: any;
  PurchaseClosing: any;
  PurchaseCurrentCr: any;
  PurchaseCurrentDr: any;

  StaffReceivablesOpening: any;
  StaffReceivablesClosing: any;
  StaffReceivablesCurrentCr: any;
  StaffReceivablesCurrentDr: any;

  constructor(private service: accountsDashboardReportService, private commonService: CommonBaseService, private router: Router) {
    super();
    this.popoverVisible = false;
    this.filter = false;
  }

  AccountGroupIdGet() {
    this.commonService
      .configurations({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => {
          for (let { ConfigDescription, ConfigKey } of result) {
            if (ConfigDescription === "Bank Control Account") {
              if (ConfigKey > 0) {
                this.accountGroupId = ConfigKey;
              } else {
                this.accountGroupId = 0;
              }
            }
          }
        },
        (error) => {
          console.log("Error in getting Account Group Id:");
          console.log(error);
        }
      );
  }

  toggle() {
    this.popoverVisible = !this.popoverVisible;
  }
  setFocus = (e) => setTimeout(() => e.component.focus(), 0);
  filtering() {
    this.filter = !this.filter;
  }

  ngOnInit(): void {
    // this.breadCrumb("Account Dashboard", "");
    this.initForm();
  }

  public initForm() {
    this.DashboardFormData = {
      // fromDate: sessionStorage.getItem("StartPeriod"),
      dateType: 0,
      fromDate: new Date(),
      toDate: new Date(),
    };
    this.DashboardFormData.dateType = this.dateList[0].Id;

    GlobalConstant.DateFromAcDashboard = this.DashboardFormData.fromDate;
    GlobalConstant.DateToAcDashboard = this.DashboardFormData.toDate;
    this.AccountsGetAll();
    this.pdcGetAll();
    this.ExportOrderGetAll();
    // this.getMonday();
  }
  getMonday(d = new Date()) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
    // console.log(new Date(d.setDate(diff)));
  }

  datetypeChanged = (e) => {
    GlobalConstant.DateFromAcDashboard = this.DashboardFormData.fromDate;
    GlobalConstant.DateToAcDashboard = this.DashboardFormData.toDate;
    if (e.value == 1) {
      this.DashboardFormData.fromDate = new Date();
      this.DashboardFormData.toDate = new Date();
      this.onSubmit();
    }
    if (e.value == 2) {
      this.DashboardFormData.fromDate = this.getMonday(new Date());
      this.DashboardFormData.toDate = new Date();
      this.onSubmit();
    }
    if (e.value == 3) {
      let my_date = new Date();
      let monthfirstdate = new Date(my_date.getFullYear(), my_date.getMonth(), 1);
      this.DashboardFormData.fromDate = monthfirstdate;
      this.DashboardFormData.toDate = new Date();
      this.onSubmit();
    }
    if (e.value == 4) {
      var Year = new Date(new Date().getFullYear(), 0, 1);
      this.DashboardFormData.fromDate = sessionStorage.getItem("StartPeriod");
      this.DashboardFormData.toDate = new Date();
      this.onSubmit();
    }
  };

  formatNumber(num) {
    let number;
    // if (num >= 0 && num != null) {
    if (num != null) {
      number = num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    } else {
      number = 0;
    }
    return number;
  }

  pdcGetAll() {
    this.service
      .accountDashboard({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
        FromDate: this.DashboardFormData.fromDate,
        ToDate: this.DashboardFormData.toDate,
        ActivityId: 2,
      })
      .subscribe((result) => {
        this.PdcCurrentStock = result.find(({ PdcDescription }) => PdcDescription == "PDC Currenct Stock");
        this.PdcTotalStock = result.find(({ PdcDescription }) => PdcDescription == "PDC Total Stock");
        // PdcCurrenctStock
        if (this.PdcCurrentStock) {
          this.PdcTitle = this.formatNumber(this.PdcCurrentStock.PdcDescription);
          this.PdcOpCheqqty = this.formatNumber(this.PdcCurrentStock.ObCheqQty);
          this.PdcOpCheqamount = this.formatNumber(this.PdcCurrentStock.obCheqsAmount);
          this.PdcCurrqty = this.formatNumber(this.PdcCurrentStock.CurrCheqsQty);
          this.PdcCurramount = this.formatNumber(this.PdcCurrentStock.CurrCheqsAmount);
          this.PdcClqty = this.formatNumber(this.PdcCurrentStock.ClCheqQty);
          this.PdcClamount = this.formatNumber(this.PdcCurrentStock.ClCheqAmount);
        } else {
          this.PdcTitle = 0;
          this.PdcOpCheqqty = 0;
          this.PdcOpCheqamount = 0;
          this.PdcCurrqty = 0;
          this.PdcCurramount = 0;
          this.PdcClqty = 0;
          this.PdcClamount = 0;
        }
        //  PdctotalStock
        if (this.PdcTotalStock) {
          this.PdcTotalTitle = this.formatNumber(this.PdcTotalStock.PdcDescription);
          this.PdctotalOpCheqqty = this.formatNumber(this.PdcTotalStock.ObCheqQty);
          this.PdctotalOpCheqamount = this.formatNumber(this.PdcTotalStock.obCheqsAmount);
          this.PdctotalCurrqty = this.formatNumber(this.PdcTotalStock.CurrCheqsQty);
          this.PdctotalCurramount = this.formatNumber(this.PdcTotalStock.CurrCheqsAmount);
          this.PdctotalClqty = this.formatNumber(this.PdcTotalStock.ClCheqQty);
          this.PdctotalClamount = this.formatNumber(this.PdcTotalStock.ClCheqAmount);
        } else {
          this.PdcTotalTitle = 0;
          this.PdctotalOpCheqqty = 0;
          this.PdctotalOpCheqamount = 0;
          this.PdctotalCurrqty = 0;
          this.PdctotalCurramount = 0;
          this.PdctotalClqty = 0;
          this.PdctotalClamount = 0;
        }
      });
  }

  AccountsGetAll() {
    this.service
      .accountDashboard({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
        FromDate: this.DashboardFormData.fromDate,
        ToDate: this.DashboardFormData.toDate,
        ActivityId: 1,
      })
      .subscribe((result) => {
        this.cashBlances = result.find(({ AccountDescription }) => AccountDescription == "Cash Balances");
        this.bankBalances = result.find(({ AccountDescription }) => AccountDescription == "Bank Balance");
        this.Payables = result.find(({ AccountDescription }) => AccountDescription == "Payables");
        this.Receivables = result.find(({ AccountDescription }) => AccountDescription == "Receivables");
        this.EximReceivables = result.find(({ AccountDescription }) => AccountDescription == "Export Receivables");
        this.TodayBuissness = result.find(({ AccountDescription }) => AccountDescription == "Today Buisness");
        this.EximPayables = result.find(({ AccountDescription }) => AccountDescription == "Export Payables");
        this.StaffReceivables = result.find(({ AccountDescription }) => AccountDescription == "Staff Receivables");
        // HAMZA MUHAMMAD FAROOQI :
        // WORKING ON LOCAL SALES
        // BRAND SALES
        // EXPORT / SALES
        // OTHER SALES
        this.localSales = result.find(({ AccountDescription }) => AccountDescription == "Local Sales");
        this.purchase = result.find(({ AccountDescription }) => AccountDescription == "Purchases");
        this.brandSales = result.find(({ AccountDescription }) => AccountDescription == "Brand Sales");
        this.exportSales = result.find(({ AccountDescription }) => AccountDescription == "Exports / Sales");
        this.otherSales = result.find(({ AccountDescription }) => AccountDescription == "Other Sales");

        if (this.StaffReceivables) {
          this.StaffReceivablesOpening = this.formatNumber(this.StaffReceivables.Opening);
          this.StaffReceivablesClosing = this.formatNumber(this.StaffReceivables.Closing);
          this.StaffReceivablesCurrentDr = this.formatNumber(this.StaffReceivables.CurrDr);
          this.StaffReceivablesCurrentCr = this.formatNumber(this.StaffReceivables.CurrCr);
        } else {
          this.StaffReceivablesOpening = 0;
          this.StaffReceivablesClosing = 0;
          this.StaffReceivablesCurrentCr = 0;
          this.StaffReceivablesCurrentDr = 0;
        }
        if (this.purchase) {
          this.PurchaseOpening = this.formatNumber(this.purchase.Opening);
          this.PurchaseClosing = this.formatNumber(this.purchase.Closing);
          this.PurchaseCurrentCr = this.formatNumber(this.purchase.CurrDr);
          this.PurchaseCurrentDr = this.formatNumber(this.purchase.CurrCr);
        } else {
          this.PurchaseOpening = 0;
          this.PurchaseClosing = 0;
          this.PurchaseCurrentCr = 0;
          this.PurchaseCurrentDr = 0;
        }
        if (this.EximReceivables) {
          this.EximReceivablesOpening = this.formatNumber(this.EximReceivables.Opening);
          this.EximReceivablesClosing = this.formatNumber(this.EximReceivables.Closing);
          this.EximReceivablesCurrDr = this.formatNumber(this.EximReceivables.CurrDr);
          this.EximReceivablesCurrCr = this.formatNumber(this.EximReceivables.CurrCr);
        } else {
          this.EximReceivablesOpening = 0;
          this.EximReceivablesClosing = 0;
          this.EximReceivablesCurrDr = 0;
          this.EximReceivablesCurrCr = 0;
        }

        //cashBalances
        // this.cashTitle = this.cashBlances.AccountDescription;
        if (this.cashBlances) {
          // this.cashOpening = this.cashBlances.Opening;
          this.cashOpening = this.formatNumber(this.cashBlances.Opening); // 102,665
          this.cashClosing = this.formatNumber(this.cashBlances.Closing);
          this.cashCurrDr = this.formatNumber(this.cashBlances.CurrDr);
          this.cashCurrCr = this.formatNumber(this.cashBlances.CurrCr);
        } else {
          this.cashOpening = 0;
          this.cashClosing = 0;
          this.cashCurrDr = 0;
          this.cashCurrCr = 0;
        }
        //Bank Balances
        // this.bankTitle = this.bankBalances.AccountDescription;
        if (this.bankBalances) {
          this.bankOpening = this.formatNumber(this.bankBalances.Opening);
          this.bankClosing = this.formatNumber(this.bankBalances.Closing);
          this.bankCurrDr = this.formatNumber(this.bankBalances.CurrDr);
          this.bankCurrCr = this.formatNumber(this.bankBalances.CurrCr);
        } else {
          this.bankOpening = 0;
          this.bankClosing = 0;
          this.bankCurrDr = 0;
          this.bankCurrCr = 0;
        }
        //payables
        // this.payableTitle = this.Payables.AccountDescription;
        if (this.Payables) {
          this.payableOpening = this.formatNumber(this.Payables.Opening);
          this.payableClosing = this.formatNumber(this.Payables.Closing);
          this.payableCurrDr = this.formatNumber(this.Payables.CurrDr);
          this.payableCurrCr = this.formatNumber(this.Payables.CurrCr);
        } else {
          this.payableOpening = 0;
          this.payableClosing = 0;
          this.payableCurrDr = 0;
          this.payableCurrCr = 0;
        }

        //payables
        // this.receivablesTitle = this.Receivables.AccountDescription;
        if (this.Receivables) {
          this.receivablesOpening = this.formatNumber(this.Receivables.Opening);
          this.receivablesClosing = this.formatNumber(this.Receivables.Closing);
          this.receivablesCurrDr = this.formatNumber(this.Receivables.CurrDr);
          this.receivablesCurrCr = this.formatNumber(this.Receivables.CurrCr);
        } else {
          this.receivablesOpening = 0;
          this.receivablesClosing = 0;
          this.receivablesCurrDr = 0;
          this.receivablesCurrCr = 0;
        }

        //TodayBuissness
        // this.tbTitle = this.TodayBuissness.AccountDescription;
        if (this.TodayBuissness) {
          this.tbOpening = this.formatNumber(this.TodayBuissness.Opening);
          this.tbClosing = this.formatNumber(this.TodayBuissness.Closing);
          this.tbCurrDr = this.formatNumber(this.TodayBuissness.CurrDr);
          this.tbCurrCr = this.formatNumber(this.TodayBuissness.CurrCr);
        } else {
          this.tbOpening = 0;
          this.tbClosing = 0;
          this.tbCurrDr = 0;
          this.tbCurrCr = 0;
        }

        //EximReceivables
        // this.EximPayableTitle = this.EximPayables.AccountDescription;
        if (this.EximPayables) {
          this.EximPayableClosing = this.formatNumber(this.EximPayables.Closing);
          this.EximPayableCurrDr = this.formatNumber(this.EximPayables.CurrDr);
          this.EximPayableCurrCr = this.formatNumber(this.EximPayables.CurrCr);
          this.EximPayableOpening = this.formatNumber(this.EximPayables.Opening);
        } else {
          this.EximPayableClosing = 0;
          this.EximPayableCurrDr = 0;
          this.EximPayableCurrCr = 0;
          this.EximPayableOpening = 0;
        }
        if (this.localSales) {
          this.localSalesOpening = this.formatNumber(this.localSales.Opening);
          this.localSalesClosing = this.formatNumber(this.localSales.Closing);
          this.localSalesCurrentCr = this.formatNumber(this.localSales.CurrCr);
          this.localSalesCurrentDr = this.formatNumber(this.localSales.CurrDr);
        } else {
          this.localSalesClosing = 0;
          this.localSalesOpening = 0;
          this.localSalesCurrentCr = 0;
          this.localSalesCurrentDr = 0;
        }

        if (this.brandSales) {
          this.brandSalesClosing = this.formatNumber(this.brandSales.Closing);
          this.brandSalesOpening = this.formatNumber(this.brandSales.Opening);
          this.brandSalesCurrentCr = this.formatNumber(this.bankBalances.CurrCr);
          this.brandSalesCurrentDr = this.formatNumber(this.brandSales.CurrDr);
        } else {
          this.brandSalesClosing = 0;
          this.brandSalesOpening = 0;
          this.brandSalesCurrentCr = 0;
          this.brandSalesCurrentDr = 0;
        }

        if (this.exportSales) {
          this.exportSalesClosing = this.formatNumber(this.exportSales.Closing);
          this.exportSalesOpening = this.formatNumber(this.exportSales.Opening);
          this.exportSalesCurrentCr = this.formatNumber(this.exportSales.CurrCr);
          this.exportSalesCurrentDr = this.formatNumber(this.exportSales.CurrDr);
        } else {
          this.exportSalesClosing = 0;
          this.exportSalesOpening = 0;
          this.exportSalesCurrentCr = 0;
          this.exportSalesCurrentDr = 0;
        }

        if (this.otherSales) {
          this.otherSalesClosing = this.formatNumber(this.otherSales.Closing);
          this.otherSalesOpening = this.formatNumber(this.otherSales.Opening);
          this.otherSalesCurrentCr = this.formatNumber(this.otherSales.CurrCr);
          this.otherSalesCurrentDr = this.formatNumber(this.otherSales.CurrDr);
        } else {
          this.otherSalesClosing = 0;
          this.otherSalesOpening = 0;
          this.otherSalesCurrentCr = 0;
          this.otherSalesCurrentDr = 0;
        }

        //EximPayables
        // this.EximReceivablesTitle = this.EximReceivables.AccountDescription;
      });
  }
  ExportOrderGetAll() {
    this.service
      .accountDashboard({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
        FromDate: this.DashboardFormData.fromDate,
        ToDate: this.DashboardFormData.toDate,
        ActivityId: 3,
      })
      .subscribe((result) => {
        this.EximContracts = result.find(({ ExportDescription }) => ExportDescription == "Outstanding Export Contracts");
        if (this.EximContracts) {
          this.EximContractMTon = this.formatNumber(this.EximContracts.ContractWeight);
          this.EximContractCntrs = this.formatNumber(this.EximContracts.ContractCntrs);
          this.EximShippedCntrs = this.formatNumber(this.EximContracts.ShippedCntrs);
          this.EximShippedMTon = this.formatNumber(this.EximContracts.ShippedWeight);
          this.EximBalanceCntrs = this.formatNumber(this.EximContracts.BalanceCnntrs);
          this.EximBalanceMton = this.formatNumber(this.EximContracts.BalanceWeight);
        } else {
          this.EximContractMTon = 0;
          this.EximContractCntrs = 0;
          this.EximShippedCntrs = 0;
          this.EximShippedMTon = 0;
          this.EximBalanceCntrs = 0;
          this.EximBalanceMton = 0;
        }
      });
  }
  onSubmit() {
    const result: any = this.DashboardForm.instance.validate();
    GlobalConstant.DateFromAcDashboard = this.DashboardFormData.fromDate;
    GlobalConstant.DateToAcDashboard = this.DashboardFormData.toDate;
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.AccountsGetAll();
      this.pdcGetAll();
      this.ExportOrderGetAll();
    }
  }
  clear() {
    this.DashboardForm.instance.resetValues();
  }

  GoToSelectedTrialBalanceFromPurchases() {
    GlobalConstant.AccountIdAcDashboard = 50;
    this.router.navigate(["/account-reports/trial-balance-selected"]);
  }
  GoToSelectedTrialBalanceFromLocalSales() {
    GlobalConstant.AccountIdAcDashboard = 108;
    this.router.navigate(["/account-reports/trial-balance-selected"]);
  }
  GoToSelectedTrialBalanceFromBrandSales() {
    GlobalConstant.AccountIdAcDashboard = 110;
    this.router.navigate(["/account-reports/trial-balance-selected"]);
  }
  GoToSelectedTrialBalanceFromExportSales() {
    GlobalConstant.AccountIdAcDashboard = 109;
    this.router.navigate(["/account-reports/trial-balance-selected"]);
  }
  GoToSelectedTrialBalanceFromOtherSales() {
    GlobalConstant.AccountIdAcDashboard = 111;
    this.router.navigate(["/account-reports/trial-balance-selected"]);
  }
  GoToSelectedTrialBalanceFromStaffReceivables() {
    // GlobalConstant.AccountIdAcDashboard = 88;
    // this.router.navigate(["/account-reports/trial-balance-selected"]);
    this.popupDataSource = [];
    this.dashboardTitle = "Staff Payables & Receivablce";
    this.loadStatus = !this.loadStatus;
    this.onLoadPopupData();
  }

  //Popup Data
  onLoadPopupData() {
    this.popoverVisible = false;
    this.service
      .AccountsBalancesForExectiveDashboard({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
        FromDate: this.DashboardFormData.fromDate,
        ToDate: this.DashboardFormData.toDate,
        AccountTypeId: 5,
        ApprovedFilter: "All",
      })
      .subscribe(
        (result) => {
          this.popupDataSource = result.filter(({ ClDebit, ClCredit }) => ClDebit > 0 || ClCredit > 0);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onToolbarPreparing(event) {
    this.toolbarPreparing(
      event,
      () => this.dataGrid.instance.refresh(),
      () => this.exportGrid(this.dataGrid.instance)
    );
  }

  // *********************************************************************
}
