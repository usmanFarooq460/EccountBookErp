import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { ChartOfAccountReportService } from "./chart-of-account.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-chart-of-account",
  templateUrl: "./chart-of-account.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class ChartOfAccountComponent extends BaseActions implements OnInit {
  @Input() IsLoadedInPopup: boolean = false;
  @ViewChild("chartOfAccountGrid", { static: false })
  chartOfAccountGrid: DxDataGridComponent;

  @ViewChild("chartOfAccountForm", { static: false })
  chartOfAccountForm: DxFormComponent;
  chartOfAccountFormData: any;
  ReportInfo: string = "";

  dataSource = [];

  constructor(private router: Router, private service: ChartOfAccountReportService, private commonService: CommonBaseService) {
    super();
    this.popoverVisible = false;
    this.filter = false;
  }

  ngOnInit(): void {
    this.breadCrumb("Account Reports", "Chart of Account");

    this.ChartOfAccountReport();
  }
  filtering() {
    this.filter = !this.filter;
  }

  ReportRegister114(e) {
    // this.AcitvateButtonLoadIndicator();
    this.service
      .AcRptChartOfAccounts_114({
        //Compulosry
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "114-AcRptChartOfAccounts",
      })
      .subscribe(
        (result) => {
          window.open(result);
          // this.DeActivateButtonLoadIndicator();
        },
        (error) => {
          if (error.ExceptionMessage) {
            this.ErrorPopup(error.ExceptionMessage);
          } else if (error.Message) {
            this.ErrorPopup(error.Message);
          } else {
            this.ErrorPopup(error);
          }
        }
      );
  }

  ChartOfAccountReport() {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .chartofaccount({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.dataSource = result;
          this.DeActivateLoadPanel();
        },
        (error) => {
          this.DeActivateLoadPanel();
          if (error.ExceptionMessage) {
            this.ErrorPopup(error.ExceptionMessage);
          } else if (error.Message) {
            this.ErrorPopup(error.Message);
          } else {
            this.ErrorPopup(error);
          }
        }
      );
  }

  goBack() {
    this.router.navigate(["/admin-panel/report-panel"]);
  }

  onToolPreparingOfItemHistoryGrid = (e) => {
    e.toolbarOptions.items.unshift(
      {
        location: "after",
        widget: "dxButton",
        options: {
          id: "outstandingPaddyPurchaseOrderChartButton",
          icon: "print",
          hint: "Print 114-Register-Report",
          onClick: this.ReportRegister114.bind(this),
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          id: "outstandingPaddyPurchaseOrderChartButton",
          icon: "back",
          hint: "Back",
          onClick: this.goBack.bind(this),
        },
      }
    );

    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.ChartOfAccountReport(),
      () => this.RefreshHistoryGridGrid(this.ChartOfAccountReport.bind(this), this.HistoryGridSateKey("chartOfAccountGrid"), this.chartOfAccountGrid)
    );
  };
}
