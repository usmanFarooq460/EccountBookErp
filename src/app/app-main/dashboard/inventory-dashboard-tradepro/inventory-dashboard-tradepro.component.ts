import { Component, OnInit, HostListener, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { AccountDashboardTradeProService } from "./inventory-dashboard-tradepro.service";
import { Router, RouterLink } from "@angular/router";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { InventoryDashboardModel } from "./inventory-dashboard-tradepro.model";
import notify from "devextreme/ui/notify";

@Component({
  selector: "app-accounts-dashboard",
  templateUrl: "./inventory-dashboard-tradepro.component.html",
  styleUrls: ["./inventory-dashboard-tradepro.component.scss"],
})
@Injectable({
  providedIn: "root",
})
export class InventoryDasboardTradeProComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("InventoryDashboardTradeProForm", { static: false })
  InventoryDashboardTradeProForm: DxFormComponent;
  InventoryDashboardTradeProFormData: InventoryDashboardModel;

  // @ViewChild("PopupDasboardForm", { static: false })
  // PopupDasboardForm: DxFormComponent;
  // PopupDasboardFormData: InventoryDashboardModel;
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
  supplierList: any;

  constructor(private service: AccountDashboardTradeProService, private commonService: CommonBaseService, private router: Router) {
    super();
    this.popoverVisible = false;
    this.filter = false;
  }
  ngOnInit(): void {
    this.breadCrumb("Inventory Dashboard", "");
    this.initForm();
  }
  public initForm() {
    this.InventoryDashboardTradeProFormData = new InventoryDashboardModel();
    this.InventoryDashboardTradeProFormData.FromDate = new Date();
    this.InventoryDashboardTradeProFormData.ToDate = new Date();
    this.InventoryDashboardTradeProFormData.dateType = this.dateList[0].Id;
    this.onSubmit();
  }

  //#region Function
  CustomerAccount() {
    this.service
      .SupplierCustomer({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.supplierList = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  //#endregion
  //#region StartScreenResponsiveness

  InventoryPLPopupHeight: number = window.innerHeight - 150;
  InventoryPLPopupWidth: number = window.innerWidth - 150;
  InventoryPLPopupGridWidth: number = window.innerWidth - 200;
  InventoryPLPopupGridheight: number = window.innerHeight - 220;
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    event.target.innerWidth;
    let height = event.target.innerHeight;
    let width = event.target.innerWidth;
    this.InventoryPLPopupHeight = height - (height * 20) / 100;
    this.InventoryPLPopupWidth = width - (width * 20) / 100;
    this.InventoryPLPopupGridWidth = width - (width * 23) / 100;
    this.InventoryPLPopupGridheight = height - (height * 27) / 100;
  }
  //#endregion
  //ShowHidePopup
  toggle() {
    this.popoverVisible = !this.popoverVisible;
  }
  //SetFocus
  setFocus = (e) => setTimeout(() => e.component.focus(), 0);
  //SetFilter
  filtering() {
    this.filter = !this.filter;
  }
  closeAccountsPopupGrid() {
    this.loadStatus = !this.loadStatus;
    this.InventoryDashboardTradeProFormData.ToDocNo = null;
    this.InventoryDashboardTradeProFormData.FromDocNo = null;
    this.InventoryDashboardTradeProFormData.SupplierCustomerId = null;
  }
  //#region DateFormating
  getMonday(d = new Date()) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
    // console.log(new Date(d.setDate(diff)));
  }

  datetypeChanged = (e) => {
    if (e.value == 1) {
      this.InventoryDashboardTradeProFormData.FromDate = new Date();
      this.InventoryDashboardTradeProFormData.ToDate = new Date();
      this.onSubmit();
    }
    if (e.value == 2) {
      this.InventoryDashboardTradeProFormData.FromDate = this.getMonday(new Date());
      this.InventoryDashboardTradeProFormData.ToDate = new Date();
      this.onSubmit();
    }
    if (e.value == 3) {
      let my_date = new Date();
      let monthfirstdate = new Date(my_date.getFullYear(), my_date.getMonth(), 1);
      this.InventoryDashboardTradeProFormData.FromDate = monthfirstdate;
      this.InventoryDashboardTradeProFormData.ToDate = new Date();
      this.onSubmit();
    }
    if (e.value == 4) {
      var Year = new Date(new Date().getFullYear(), 0, 1);
      this.InventoryDashboardTradeProFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
      this.InventoryDashboardTradeProFormData.ToDate = new Date();
      this.onSubmit();
    }
  };

  formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  //#endregion
  //#region Show Report ProfitLoss
  ShowProfitLossDetailReport() {
    if (this.dataSource.length > 0) {
      this.loadStatus = !this.loadStatus;
      this.CustomerAccount();
      this.ShowDetailProfitLossReport();
    } else {
      notify("No Record To Show", "error");
      return;
    }
  }
  onSubmit() {
    const result: any = this.InventoryDashboardTradeProForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    }
    this.service
      .InventoryDashboardTradePro({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        FromDate: this.InventoryDashboardTradeProFormData.FromDate,
        ToDate: this.InventoryDashboardTradeProFormData.ToDate,
      })
      .subscribe((result) => {
        this.dataSource = result;
      });
  }
  ShowDetailProfitLossReport() {
    const result: any = this.InventoryDashboardTradeProForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    }
    this.service
      .InventoryProfitLossReportTradePro({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        FromDate: this.InventoryDashboardTradeProFormData.FromDate,
        ToDate: this.InventoryDashboardTradeProFormData.ToDate,
        SupplierCustomerId: this.InventoryDashboardTradeProFormData.SupplierCustomerId,
        FromDocNo: this.InventoryDashboardTradeProFormData.FromDocNo,
        ToDocNo: this.InventoryDashboardTradeProFormData.ToDocNo,
      })
      .subscribe((result) => {
        this.popupDataSource = result;
      });
  }
  //#endregion
  //#region   ProfitLossSlip
  ProfitLossReportpdfRegister() {
    if (this.InventoryDashboardTradeProFormData) {
      this.service
        .ProfitLossReportpdfRegister({
          //Compulosry
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.InventoryDashboardTradeProFormData.FromDate,
          ToDate: this.InventoryDashboardTradeProFormData.ToDate,
          SupplierCustomerId: this.InventoryDashboardTradeProFormData.SupplierCustomerId,
          FromDocNo: this.InventoryDashboardTradeProFormData.FromDocNo,
          ToDocNo: this.InventoryDashboardTradeProFormData.ToDocNo,

          ReportName: "ProfitLossReportTradePro",
        })
        .subscribe(
          (result) => window.open(result),
          (error) => {
            notify(error.ExceptionMessage, "error");
          }
        );
    } else {
      notify("Record Not Found", "error");
    }
  }
  //#endregion
  clear() {
    this.InventoryDashboardTradeProForm.instance.resetValues();
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
