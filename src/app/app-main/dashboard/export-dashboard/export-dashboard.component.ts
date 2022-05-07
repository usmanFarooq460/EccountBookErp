import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { ExportDashboardService } from "./export-dashboard.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import notify from "devextreme/ui/notify";
import { notification } from "src/app/shared/Base/notify";
import { ExportDashboardModel } from "./export-dashboard.model";

@Component({
  selector: "export-dashboard",
  templateUrl: "./export-dashboard.component.html",
  styleUrls: ["./export-dashboard.component.scss"],
})
export class ExportDashboardComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild(DxDataGridComponent, { static: false })
  UnApprovedDeliveryOrderGrid: DxDataGridComponent;
  @ViewChild("ExportDasboardForm", { static: false })
  ExportDasboardForm: DxFormComponent;
  ExportDasboardFormData: ExportDashboardModel;
  filter: boolean = false;
  outstandingPopupFilter: boolean = false;
  dataSource = [];
  dateList = [
    { Id: 1, name: "Today" },
    { Id: 2, name: "Current Week" },
    { Id: 3, name: "Current Month" },
    { Id: 4, name: "Current Year" },
  ];
  outstandingcontractDataSource = [];

  outstandingBlNotReceivedDataSource = [];
  outstandingPaymentNotReceivedDataSource = [];
  totalExportByFinancialYearDataSource = [];
  outstandingPaymentNotRecevied = [];
  TotalExportContractDataSource = [];
  currentMonthExportDataSource = [];
  //
  OutStandingContractsDetailDataSource = [];
  OutStandingContractsDetailDataSourceLength = [];
  totalContractToolTipValue: boolean = false;
  //
  DetailPopupHeight: number = window.innerHeight - 150;
  DetailPopupWidth: number = window.innerWidth - 150;
  DetailPopupGridWidth: number = window.innerWidth - 120;
  OutStandingOrderPopupVisible: boolean = false;
  //
  ForwardedButBLNotReceivedDataSource = [];
  ForwardedButBLNotReceivedDataSourceLength = [];
  ForwardedButBLNotReceivedPopupFilter: boolean = false;
  ForwardedButBLNotReceivedVisible: boolean = false;
  //
  ForwardedButPaymentNotReceivedDataSource = [];
  ForwardedButPaymentNotReceivedDataSourceLength = [];
  ForwardedButPaymentNotReceivedPopupFilter: boolean = false;
  ForwardedButPaymentNotReceivedVisible: boolean = false;

  constructor(private service: ExportDashboardService, private router: Router, private commonService: CommonBaseService) {
    super();
  }
  ngOnInit(): void {
    this.breadCrumb("Export Dashboard", "");
    this.ExportDasboardFormData = new ExportDashboardModel();
    this.ExportDasboardFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.ExportDasboardFormData.ToDate = new Date();
    this.onSubmit();
  }
  showFirstToolTip() {
    this.totalContractToolTipValue = !this.totalContractToolTipValue;
  }
  filtering() {
    this.filter = !this.filter;
  }
  filteringOutstandsingPopup() {
    this.outstandingPopupFilter = !this.outstandingPopupFilter;
  }
  setFocus = (e) => setTimeout(() => e.component.focus(), 0);
  //#region DateChange
  datetypeChanged = (e) => {
    if (e.value == 1) {
      this.ExportDasboardFormData.FromDate = new Date();
      this.ExportDasboardFormData.ToDate = new Date();
      this.onSubmit();
    }
    if (e.value == 2) {
      this.ExportDasboardFormData.FromDate = this.getMonday(new Date());
      this.ExportDasboardFormData.ToDate = new Date();
      this.onSubmit();
    }
    if (e.value == 3) {
      let my_date = new Date();
      let monthfirstdate = new Date(my_date.getFullYear(), my_date.getMonth(), 1);
      this.ExportDasboardFormData.FromDate = monthfirstdate;
      this.ExportDasboardFormData.ToDate = new Date();
      this.onSubmit();
    }
    if (e.value == 4) {
      var Year = new Date(new Date().getFullYear(), 0, 1);
      this.ExportDasboardFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
      this.ExportDasboardFormData.ToDate = new Date();
      this.onSubmit();
    }
  };
  getMonday(d = new Date()) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
    // console.log(new Date(d.setDate(diff)));
  }
  //#endregion
  //GetAccountsUnApproved
  onSubmit() {
    this.service
      .ReadDashboard({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        Activity: "DashboardsSummeryRecords",
        FromDate: this.ExportDasboardFormData.FromDate,
        ToDate: this.ExportDasboardFormData.ToDate,
      })
      .subscribe((result) => {
        this.TotalExportContractDataSource = result.filter(({ CaptionDescription }) => CaptionDescription == "ExportContractsTotal");
        this.outstandingcontractDataSource = result.filter(({ CaptionDescription }) => CaptionDescription == "OutstandingExportContracts");
        this.outstandingBlNotReceivedDataSource = result.filter(({ CaptionDescription }) => CaptionDescription == "ForwardedButBillofLadingNotReceived");
        this.totalExportByFinancialYearDataSource = result.filter(({ CaptionDescription }) => CaptionDescription == "TotalExportByFinancialYear");
        this.outstandingPaymentNotReceivedDataSource = result.filter(({ CaptionDescription }) => CaptionDescription == "BlReceivedButPaymentNotReceived");
        this.currentMonthExportDataSource = result.filter(({ CaptionDescription }) => CaptionDescription == "TotalExportByCurrentMonth");
      });
  }

  //#region Oustanding ORder Popup
  closOutStandingOrderApprovalPopup() {
    this.OutStandingOrderPopupVisible = false;
  }
  GetDetailOutstandingSubmit() {
    this.service
      .ReadDashboard({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        Activity: "OutstandingOrdersDetail",
        FromDate: this.ExportDasboardFormData.FromDate,
        ToDate: this.ExportDasboardFormData.ToDate,
      })
      .subscribe((result) => {
        this.OutStandingContractsDetailDataSource = result;
        this.OutStandingContractsDetailDataSourceLength = [50, 100, result.length];
        this.OutStandingOrderPopupVisible = true;
      });
  }
  //#endregion

  //#region   Forwarded But Bl Not Received
  filteringForwardedButBlNotReceivedPopup() {
    this.ForwardedButBLNotReceivedPopupFilter = !this.ForwardedButBLNotReceivedPopupFilter;
  }
  closeForwardedButBlNotReceivedPopup() {
    this.ForwardedButBLNotReceivedVisible = false;
  }
  getForwardedButBlNotReceivedReoprt() {
    this.service
      .ReadDashboard({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        Activity: "ForwardedButBillofLadingNotReceivedDetailReport",
        FromDate: this.ExportDasboardFormData.FromDate,
        ToDate: this.ExportDasboardFormData.ToDate,
      })
      .subscribe((result) => {
        this.ForwardedButBLNotReceivedDataSource = result;
        this.ForwardedButBLNotReceivedDataSourceLength = [50, 100, result.length];
        this.ForwardedButBLNotReceivedVisible = true;
      });
  }
  //#endregion

  //#region   Forwarded But Bl Not Received
  filteringForwardedButPaymentNotReceivedPopup() {
    this.ForwardedButPaymentNotReceivedPopupFilter = !this.ForwardedButPaymentNotReceivedPopupFilter;
  }
  closeForwardedButPaymentNotReceivedPopup() {
    this.ForwardedButPaymentNotReceivedVisible = false;
  }
  getForwardedButPaymentNotReceivedReoprt() {
    this.service
      .ReadDashboard({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        Activity: "BlReceivedButPaymentNotReceived",
        FromDate: this.ExportDasboardFormData.FromDate,
        ToDate: this.ExportDasboardFormData.ToDate,
      })
      .subscribe((result) => {
        this.ForwardedButPaymentNotReceivedDataSource = result;
        this.ForwardedButPaymentNotReceivedDataSourceLength = [50, 100, result.length];
        this.ForwardedButPaymentNotReceivedVisible = true;
      });
  }
  //#endregion
}
