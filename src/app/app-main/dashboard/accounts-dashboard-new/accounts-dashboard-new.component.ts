import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { accountsDashboardReportService } from "./accounts-dashboard-new.service";
import { Router } from "@angular/router";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { GlobalConstant } from "src/app/Common/global-constant";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { AccounsDashboardModel } from "./accounts-dashboard-new.model";
@Component({
  selector: "pos-accounts-dashboard",
  templateUrl: "./accounts-dashboard-new.component.html",
  styleUrls: ["./accounts-dashboard-new.component.scss"],
})
@Injectable({
  providedIn: "root",
})
export class AccountsDashboardNewComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("AccountsDashboardForm", { static: false })
  AccountsDashboardForm: DxFormComponent;
  AccountsDashboardFormData: AccounsDashboardModel;
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

  accountGroupId: number;
  FinancialYearId: number;
  //======================================================================08-Feb-2022
  DashboardDynamicObjectsList = [];
  AccountsDashboardData = [];
  constructor(private service: accountsDashboardReportService, private commonService: CommonBaseService, private router: Router, private commonMethods: CommonMethodsForCombos) {
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
  async ngOnInit() {
    this.breadCrumb("Dashboards", "Accounts Dashboard");
    this.initForm();
    this.GenerateAccountsDashboard(
      await this.commonMethods.AccountsDashboard(this.AccountsDashboardFormData.FromDate, this.AccountsDashboardFormData.ToDate),
      await this.commonMethods.DashboardDynamicObjects("ExectiveAccountsDashboard")
    );
  }
  public initForm() {
    this.AccountsDashboardFormData = new AccounsDashboardModel();
    this.AccountsDashboardFormData.dateType = this.dateList[0].Id;
    this.AccountsDashboardFormData.FromDate = new Date();
    this.AccountsDashboardFormData.ToDate = new Date();
    // GlobalConstant.DateFromAcDashboard = this.AccountsDashboardFormData.FromDate;
    // GlobalConstant.DateToAcDashboard = this.AccountsDashboardFormData.ToDate;
  }
  getMonday(d = new Date()) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
    // console.log(new Date(d.setDate(diff)));
  }
  datetypeChanged = (e) => {
    GlobalConstant.DateFromAcDashboard = this.AccountsDashboardFormData.FromDate;
    GlobalConstant.DateToAcDashboard = this.AccountsDashboardFormData.ToDate;
    if (e.value == 1) {
      this.AccountsDashboardFormData.FromDate = new Date();
      this.AccountsDashboardFormData.ToDate = new Date();
      this.onSubmit();
    }
    if (e.value == 2) {
      this.AccountsDashboardFormData.FromDate = this.getMonday(new Date());
      this.AccountsDashboardFormData.ToDate = new Date();
      this.onSubmit();
    }
    if (e.value == 3) {
      let my_date = new Date();
      let monthfirstdate = new Date(my_date.getFullYear(), my_date.getMonth(), 1);
      this.AccountsDashboardFormData.FromDate = monthfirstdate;
      this.AccountsDashboardFormData.ToDate = new Date();
      this.onSubmit();
    }
    if (e.value == 4) {
      var Year = new Date(new Date().getFullYear(), 0, 1);
      this.AccountsDashboardFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
      this.AccountsDashboardFormData.ToDate = new Date();
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

  async onSubmit() {
    const result: any = this.AccountsDashboardForm.instance.validate();
    GlobalConstant.DateFromAcDashboard = this.AccountsDashboardFormData.FromDate;
    GlobalConstant.DateToAcDashboard = this.AccountsDashboardFormData.ToDate;
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.GenerateAccountsDashboard(
        await this.commonMethods.AccountsDashboard(this.AccountsDashboardFormData.FromDate, this.AccountsDashboardFormData.ToDate),
        await this.commonMethods.DashboardDynamicObjects("ExectiveAccountsDashboard")
      );
    }
  }
  clear() {
    this.AccountsDashboardForm.instance.resetValues();
  }

  //Popup Data
  onLoadPopupData() {
    this.popoverVisible = false;
    this.service
      .AccountsBalancesForExectiveDashboard({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
        FromDate: this.AccountsDashboardFormData.FromDate,
        ToDate: this.AccountsDashboardFormData.ToDate,
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
  //08-Feb-2022 @hamzamfarooqi55

  async GenerateAccountsDashboard(data, sortingList) {
    let sortedData = [];
    for (let i = 0; i < sortingList.length; i++) {
      let filteredObject = data.find(({ AccountDescription }) => AccountDescription == sortingList[i].CardIdentitiyName);
      if (filteredObject != null && filteredObject != undefined) {
        sortedData.push(filteredObject);
      }
    }
    this.AccountsDashboardData = sortedData;
    this.DashboardDynamicObjectsList = sortingList;
    console.log(this.AccountsDashboardData);
  }
  handleMoreInfoButtonClick(dashboardObjectName) {
    let data = this.DashboardDynamicObjectsList.find(({ CardIdentitiyName }) => CardIdentitiyName == dashboardObjectName);
    if (data.RoutePopupType == "Route") {
      this.router.navigate([data.RoutePopupObjectDescription]);
    }
  }
  getBackGroundColor(index) {
    index = index + 1;
    let rowIndex = 1;
    let color = "";
    while (index > 4) {
      index = index % 4;
      rowIndex += 1;
    }
    if (rowIndex % 2 != 0) {
      switch (index) {
        case 1:
          color = "#007bff";
          break;
        case 2:
          color = "#28a745";
          break;
        case 3:
          color = "#dc3545";
          break;
        case 4:
          color = "#17a2b8";
          break;
      }
    } else if (rowIndex % 2 == 0) {
      switch (index) {
        case 4:
          color = "#007bff";
          break;
        case 3:
          color = "#28a745";
          break;
        case 2:
          color = "#dc3545";
          break;
        case 1:
          color = "#17a2b8";
          break;
      }
    }
    return color;
  }
}
