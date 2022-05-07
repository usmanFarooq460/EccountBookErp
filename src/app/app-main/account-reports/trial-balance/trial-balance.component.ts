import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { TrialBalanceService } from "./trial-balance.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import notify from "devextreme/ui/notify";
import { Router } from "@angular/router";

@Component({
  selector: "app-trial-balance",
  templateUrl: "./trial-balance.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class TrialBalanceComponent extends BaseActions implements OnInit {
  @Input() IsLoadedInPopup: boolean = false;
  @ViewChild("trialBalanceGrid", { static: false })
  trialBalanceGrid: DxDataGridComponent;

  @ViewChild("trialBalanceForm", { static: false })
  trialBalanceForm: DxFormComponent;
  trialBalanceFormData: any;

  companyList = [];
  branchList = [];
  projectList = [];
  dataSource = [];

  constructor(private router: Router, private service: TrialBalanceService, private commonService: CommonBaseService) {
    super();
    this.popoverVisible = false;
    this.filter = false;
  }

  toggle() {
    this.popoverVisible = !this.popoverVisible;
  }

  filtering() {
    this.filter = !this.filter;
  }

  async ngOnInit() {
    this.breadCrumb("Account Reports", "Trial Balance");
    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.initForm();
  }

  public initForm() {
    this.trialBalanceFormData = {
      company: this.companyList[0].Id,
      branch: this.branchList[0].Id,
      project: this.projectList[0].Id,
      fromDate: new Date(sessionStorage.getItem("StartPeriod")),
      toDate: new Date(),
    };
  }

  onSubmit() {
    const result: any = this.trialBalanceForm.instance.validate();

    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.popoverVisible = false;
      this.ActivateLoadPanel("Loading Data");
      this.service
        .trialBalance({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          FromDate: this.trialBalanceFormData.fromDate,
          ToDate: this.trialBalanceFormData.toDate,
          ZeroBalanceType: 1,
          ApprovedFilter: "All",
          BranchesId: this.trialBalanceFormData.branch,
          ProjectsId: this.trialBalanceFormData.project,
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            this.dataSource = result;
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
  }

  ReportRegister112() {
    if (this.trialBalanceFormData) {
      this.ActivateLoadPanel("Loading Report!");
      this.service
        .AcRptTrialBalances_112({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          FinancialYearId: sessionStorage.getItem("FinancialYearId"),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          ZeroBalanceType: 1,
          ApprovedFilter: "All",
          FromDate: this.trialBalanceFormData.fromDate,
          ToDate: this.trialBalanceFormData.toDate,
          ReportName: "112-AcRptTrialBalances",
        })
        .subscribe(
          (result) => {
            console.log(result);
            this.DeActivateLoadPanel();
            window.open(result);
          },
          (error) => {
            
            this.DeActivateLoadPanel();
            this.HandleError(error)
          }
        );
    } else {
      this.ErrorPopup("Record not Found");
      // notify("Record Not Found", "error");
    }
  }

  clear() {
    // this.trialBalanceForm.instance.resetValues();
    (this.trialBalanceFormData.fromDate = sessionStorage.getItem("StartPeriod")), (this.trialBalanceFormData.toDate = new Date()), this.trialBalanceForm.instance.getEditor("fromDate").focus();
  }

  goBack() {
    this.router.navigate(["/admin-panel/report-panel"]);
  }

  onToolPreparingOfItemHistoryGrid = (e) => {
    e.toolbarOptions.items.unshift({
      location: "after",
      widget: "dxButton",
      options: {
        id: "outstandingPaddyPurchaseOrderChartButton",
        icon: "print",
        hint: "Print 112-Register-Report",
        onClick: this.ReportRegister112.bind(this),
      },
    });

    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.onSubmit(),
      () => this.RefreshHistoryGridGrid(this.onSubmit.bind(this), this.HistoryGridSateKey("trialBalanceGrid"), this.trialBalanceGrid)
    );
  };
}
