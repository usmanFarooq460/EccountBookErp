import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { BalanceSheetService } from "./balance-sheet.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { AccountsDashboardComponent } from "../../dashboard/accounts-dashboard";
import { GlobalConstant } from "src/app/Common/global-constant";
import { Router } from "@angular/router";
@Component({
  selector: "app-balance-sheet",
  templateUrl: "./balance-sheet.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class BalanceSheetComponent extends BaseActions implements OnInit {
  @Input() IsLoadedInPopup: boolean = false;
  @ViewChild("balanceSheet", { static: false })
  balanceSheet: DxDataGridComponent;
  @ViewChild("balanceSheetForm", { static: false })
  balanceSheetForm: DxFormComponent;
  balanceSheetFormData: any;
  companyList = [];
  branchList = [];
  projectList = [];
  dataSource = [];
  getdatefromDashboard: Date;
  getdatetoDashboard: Date;
  constructor(private router: Router, private service: BalanceSheetService, private commonService: CommonBaseService, private DashboardData: AccountsDashboardComponent) {
    super();
  }

  async ngOnInit() {
    this.breadCrumb("Account Reports", "Balance Sheet");
    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.filtering();
    this.initForm();
    this.OnLoadSubmit();
  }

  public initForm() {
    this.balanceSheetFormData = {
      company: this.companyList[0].Id,
      branch: this.branchList[0].Id,
      project: this.projectList[0].Id,
      fromDate: sessionStorage.getItem("StartPeriod"),
      toDate: new Date(),
    };

    if (GlobalConstant.DateFromAcDashboard && GlobalConstant.DateToAcDashboard) {
      this.balanceSheetFormData.fromDate = GlobalConstant.DateFromAcDashboard;
      this.balanceSheetFormData.toDate = GlobalConstant.DateToAcDashboard;
    }
  }

  OnLoadSubmit() {
    this.popoverVisible = false;
    this.ActivateLoadPanel("Loading Data");
    this.service
      .BalanceSheet({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
        FromDate: this.balanceSheetFormData.fromDate,
        ToDate: this.balanceSheetFormData.toDate,
        BranchesId: this.balanceSheetFormData.branch,
        ProjectsId: this.balanceSheetFormData.project,
        ApprovedFilter: "All",
      })
      .subscribe(
        (result) => {
          console.log(result);
          this.DeActivateLoadPanel();
          this.dataSource = result;
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }

  onSubmit() {
    const result: any = this.balanceSheetForm.instance.validate();
    if (result.isValid == false) {
      result.brokenRules[0].validate.focus();
    } else {
      this.popoverVisible = false;
      this.ActivateLoadPanel("Loading Data");
      this.service
        .BalanceSheet({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          FromDate: this.balanceSheetFormData.fromDate,
          ToDate: this.balanceSheetFormData.toDate,
          BranchesId: this.balanceSheetFormData.branch,
          ProjectsId: this.balanceSheetFormData.project,
          ApprovedFilter: "All",
        })
        .subscribe(
          (result) => {
            console.log(result);
            this.DeActivateLoadPanel();
            this.dataSource = result;
          },
          (error) => {
            this.DeActivateLoadPanel();
            this.HandleError(error);
          }
        );
    }
  }

  ReportRegiste153() {
    this.ActivateLoadPanel("Loading Data");
    if (this.balanceSheetFormData) {
      this.service
        .BLSummaryReport153({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.balanceSheetFormData.fromDate,
          ToDate: this.balanceSheetFormData.toDate,
          ReportName: "153-BalanceSheetStatementRpt",
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel(), window.open(result);
          },
          (error) => {
            this.DeActivateLoadPanel();
            this.HandleError(error);
          }
        );
    } else {
      this.ErrorPopup("Record Not Found");
    }
  }

  ProfitLossReport154() {
    this.ActivateLoadPanel("Loading Data");
    if (this.balanceSheetFormData) {
      this.service
        .ProfitLossReport154({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.balanceSheetFormData.fromDate,
          ToDate: this.balanceSheetFormData.toDate,

          ReportName: "154-Profit&Loss",
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            window.open(result);
          },
          (error) => {
            this.DeActivateLoadPanel();
            this.HandleError(error);
          }
        );
    } else {
      this.ErrorPopup("Record Not Found");
    }
  }

  clear() {
    this.balanceSheetFormData.fromDate = sessionStorage.getItem("StartPeriod");
    this.balanceSheetFormData.toDate = new Date();
    this.balanceSheetForm.instance.getEditor("fromDate").focus();
  }

  onToolPreparingOfItemHistoryGrid = (e) => {
    this.ReportButtonInGridToolbar(e, "153-B/S Report print", this.ReportRegiste153.bind(this));
    this.ReportButtonInGridToolbar(e, "154-P/L Report print", this.ProfitLossReport154.bind(this));
    this.FilterButtonInGridToolbar(e);
    this.RefreshHistoryGridGrid(() => this.OnLoadSubmit.bind(this), this.HistoryGridSateKey("balanceSheet"), this.balanceSheet);
  };
}
