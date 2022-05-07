import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { AccountDashboardTradeProService } from "./accounts-dashboard-tradePro.service";
import { Router, RouterLink } from "@angular/router";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { GlobalConstant } from "src/app/Common/global-constant";

@Component({
  selector: "app-accounts-dashboard",
  templateUrl: "./accounts-dashboard-tradePro.component.html",
  styleUrls: ["./accounts-dashboard-tradePro.component.scss"],
})
@Injectable({
  providedIn: "root",
})
export class AccountsDasboardTradeProComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("AccountsDashboardTradeProForm", { static: false })
  AccountsDashboardTradeProForm: DxFormComponent;
  AccountsDashboardTradeProFormData: any;
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
  // By Hamza Muhammad Farooqi
  //CashBalances
  cashTitle;
  cashOpening: number;
  cashClosing: number;
  cashCurrDr: number;
  cashCurrCr: number;
  //BankBalances
  bankTitle;
  bankOpening: number;
  bankClosing: number;
  bankCurrDr: number;
  bankCurrCr: number;
  //Payables
  payableTitle;
  payableOpening: number;
  payableClosing: number;
  payableCurrDr: number;
  payableCurrCr: number;
  //Receivables
  receivablesTitle;
  receivablesOpening: number;
  receivablesClosing: number;
  receivablesCurrDr: number;
  receivablesCurrCr: number;
  //TodayBuissness
  tbTitle;
  tbOpening: number;
  tbClosing: number;
  tbCurrDr: number;
  tbCurrCr: number;
  //Export Contract
  accountGroupId: number;
  FinancialYearId: number;
  constructor(private service: AccountDashboardTradeProService, private commonService: CommonBaseService, private router: Router) {
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
    this.AccountsDashboardTradeProFormData = {
      // fromDate: sessionStorage.getItem("StartPeriod"),
      dateType: 0,
      fromDate: new Date(),
      toDate: new Date(),
    };
    this.AccountsDashboardTradeProFormData.dateType = this.dateList[0].Id;

    GlobalConstant.DateFromAcDashboard = this.AccountsDashboardTradeProFormData.fromDate;
    GlobalConstant.DateToAcDashboard = this.AccountsDashboardTradeProFormData.toDate;
    this.AccountsGetAll();
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
    GlobalConstant.DateFromAcDashboard = this.AccountsDashboardTradeProFormData.fromDate;
    GlobalConstant.DateToAcDashboard = this.AccountsDashboardTradeProFormData.toDate;
    if (e.value == 1) {
      this.AccountsDashboardTradeProFormData.fromDate = new Date();
      this.AccountsDashboardTradeProFormData.toDate = new Date();
      this.onSubmit();
    }
    if (e.value == 2) {
      this.AccountsDashboardTradeProFormData.fromDate = this.getMonday(new Date());
      this.AccountsDashboardTradeProFormData.toDate = new Date();
      this.onSubmit();
    }
    if (e.value == 3) {
      let my_date = new Date();
      let monthfirstdate = new Date(my_date.getFullYear(), my_date.getMonth(), 1);
      this.AccountsDashboardTradeProFormData.fromDate = monthfirstdate;
      this.AccountsDashboardTradeProFormData.toDate = new Date();
      this.onSubmit();
    }
    if (e.value == 4) {
      var Year = new Date(new Date().getFullYear(), 0, 1);
      this.AccountsDashboardTradeProFormData.fromDate = sessionStorage.getItem("StartPeriod");
      this.AccountsDashboardTradeProFormData.toDate = new Date();
      this.onSubmit();
    }
  };

  formatNumber(num) {
    let number;
    if (num != null) {
      number = num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    } else {
      number = 0;
    }
    return number;
  }
  AccountsGetAll() {
    this.service
      .accountDashboard({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
        FromDate: this.AccountsDashboardTradeProFormData.fromDate,
        ToDate: this.AccountsDashboardTradeProFormData.toDate,
        ActivityId: 1,
      })
      .subscribe((result) => {
        this.cashBlances = result.find(({ AccountDescription }) => AccountDescription == "Cash Balances");
        this.bankBalances = result.find(({ AccountDescription }) => AccountDescription == "Bank Balance");
        this.Payables = result.find(({ AccountDescription }) => AccountDescription == "Payables");
        this.Receivables = result.find(({ AccountDescription }) => AccountDescription == "Receivables");
        this.TodayBuissness = result.find(({ AccountDescription }) => AccountDescription == "Today Buisness");
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
      });
  }
  // ExportOrderGetAll() {
  //   this.service
  //     .accountDashboard({
  //       OrganizationId: sessionStorage.getItem("OrganizationId"),
  //       CompanyId: sessionStorage.getItem("CompanyId"),
  //       FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
  //       FromDate: this.AccountsDashboardTradeProFormData.fromDate,
  //       ToDate: this.AccountsDashboardTradeProFormData.toDate,
  //       ActivityId: 3,
  //     })
  //     .subscribe((result) => {
  //       this.EximContracts = result.find(({ ExportDescription }) => ExportDescription == "Outstanding Export Contracts");
  //       if (this.EximContracts) {
  //         this.EximContractMTon = this.formatNumber(this.EximContracts.ContractWeight);
  //         this.EximContractCntrs = this.formatNumber(this.EximContracts.ContractCntrs);
  //         this.EximShippedCntrs = this.formatNumber(this.EximContracts.ShippedCntrs);
  //         this.EximShippedMTon = this.formatNumber(this.EximContracts.ShippedWeight);
  //         this.EximBalanceCntrs = this.formatNumber(this.EximContracts.BalanceCnntrs);
  //         this.EximBalanceMton = this.formatNumber(this.EximContracts.BalanceWeight);
  //       } else {
  //         this.EximContractMTon = 0;
  //         this.EximContractCntrs = 0;
  //         this.EximShippedCntrs = 0;
  //         this.EximShippedMTon = 0;
  //         this.EximBalanceCntrs = 0;
  //         this.EximBalanceMton = 0;
  //       }
  //     });
  // }
  onSubmit() {
    const result: any = this.AccountsDashboardTradeProForm.instance.validate();
    GlobalConstant.DateFromAcDashboard = this.AccountsDashboardTradeProFormData.fromDate;
    GlobalConstant.DateToAcDashboard = this.AccountsDashboardTradeProFormData.toDate;
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.AccountsGetAll();
    }
  }
  clear() {
    this.AccountsDashboardTradeProForm.instance.resetValues();
  }
  GoToSelectedTrialBalanceFromPurchases() {
    GlobalConstant.AccountIdAcDashboard = 50;
    this.router.navigate(["/account-reports/trial-balance-selected"]);
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
