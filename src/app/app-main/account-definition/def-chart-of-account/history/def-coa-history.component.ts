import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { DefChartOfAccountService } from "../def-chart-of-account.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
@Component({
  selector: "app-def-chart-of-account",
  templateUrl: "./def-coa-history.component.html",
  styleUrls: [],
})
export class DefChartOfAccountHistoryComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  dataSource = [];
  accountCodeValue: number;
  //UserRights
  canView: boolean;
  canSave: boolean;
  canPrint: boolean;
  canUpdate: boolean;
  //=============================================================================
  ChartOfAccountFormPopupVisible: boolean = false;
  @ViewChild("DefineChartOfAccountFormComponent")
  DefineChartOfAccountFormComponent;
  constructor(private service: DefChartOfAccountService, private commonService: CommonBaseService) {
    super();
    this.filter = false;
  }
  async ngOnInit() {
    this.breadCrumb("Account Definition", "Chart of Account");
    this.chartOfAccountReport();
    this.userRights();
  }
  userRights() {
    this.commonService
      .userRights({
        UserId: this.commonService.UserId(),
        ScreenName: "AcfrmDefCoa",
        RightName: this.commonService.RoleName(),
      })
      .subscribe(
        (result) => {
          for (let { RightName, Value } of result) {
            if (RightName === "Save") {
              this.canSave = Value;
            }
          }
        },
        (error) => console.log(error)
      );
  }
  //ReportShow
  chartOfAccountReport() {
    this.service
      .chartofaccount({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => {
          this.DefineChartOfAccountFormComponent.FilterAccountsByLevel(result);
          this.dataSource = result;
        },
        (error) => console.log(error)
      );
  }
  DummyMethod() {}
  onToolbarPreparing(event) {
    this.HistoryGridToolBarPreparing(
      event,
      () => this.filtering(),
      () => this.chartOfAccountReport(),
      () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("ChartOfAccountHistoryGrid"), this.dataGrid)
    );
  }
  //
  //============================================================================
  handleChartOfAccountFormPopupVisibility(e) {
    this.ChartOfAccountFormPopupVisible = !this.ChartOfAccountFormPopupVisible;
  }
  //============================================================================
}
