import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { TrialBalanceSelectedService } from "./trial-balance-selected.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { AccountsDashboardComponent } from "../../dashboard/accounts-dashboard";
import { GlobalConstant } from "src/app/Common/global-constant";
import { Router } from "@angular/router";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "app-trial-balance-selected",
  templateUrl: "./trial-balance-selected.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class TrialBalanceSelectedComponent extends BaseActions implements OnInit {
  @Input() IsLoadedInPopup: boolean = false;
  @ViewChild("trialbalanceSelectedGrid", { static: false })
  trialbalanceSelectedGrid: DxDataGridComponent;

  @ViewChild("trialBalanceSelectedForm", { static: false })
  trialBalanceSelectedForm: DxFormComponent;
  trialBalanceSelectedFormData: any;

  accountTitle: string = "";
  accountList: any;
  dataSource = [];

  constructor(
    private commonMethods: CommonMethodsForCombos,
    private router: Router,
    private service: TrialBalanceSelectedService,
    private commonService: CommonBaseService,
    private DashboardData: AccountsDashboardComponent
  ) {
    super();
  }

  async ngOnInit() {
    this.breadCrumb("Account Reports", "Selected Trial Balance");
    this.ReadAllParentGroupAccount();
    this.initForm();
    this.onLoadSubmit();
  }

  ReadAllParentGroupAccount() {
    this.service
      .ReadAllParentGroupAccount({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FinancialYearId: sessionStorage.getItem("FinancialYearId"),
      })
      .subscribe(
        (result) => {
          this.ReadAllParentGroupAccountWithPagination(result);
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  async ReadAllParentGroupAccountWithPagination(date) {
    this.accountList = await this.commonMethods.GenerateDataSourceFromList(await date);
  }

  public initForm() {
    this.trialBalanceSelectedFormData = {
      account: "",
      FromDate: sessionStorage.getItem("StartPeriod"),
      ToDate: new Date(),
    };
  }
  ReportRegister113() {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .AcRptTrialBalanceSelectedGroupAc_113({
        //Compulosry
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        FinancialYearId: sessionStorage.getItem("FinancialYearId"),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        GroupAccountId: this.trialBalanceSelectedFormData.account,
        FromDate: this.trialBalanceSelectedFormData.FromDate,
        ToDate: this.trialBalanceSelectedFormData.ToDate,
        ReportName: "113-AcRptTrialBalanceSelectedGroupAc",
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
  }

  ReportRegister117() {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .AcRptTrialBalanceSelectedCurrent_117({
        //Compulosry
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        FinancialYearId: sessionStorage.getItem("FinancialYearId"),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        GroupAccountId: this.trialBalanceSelectedFormData.account,
        FromDate: this.trialBalanceSelectedFormData.FromDate,
        ToDate: this.trialBalanceSelectedFormData.ToDate,
        ReportName: "117-AcRptTrialBalanceSelectedCurrent",
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
  }

  onLoadSubmit() {
    if (GlobalConstant.AccountIdAcDashboard > 0) {
      this.ActivateLoadPanel("Loading Data");
      this.service
        .trailbalanceselected({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          FromDate: this.trialBalanceSelectedFormData.FromDate,
          ToDate: this.trialBalanceSelectedFormData.ToDate,
          GroupAccountId: GlobalConstant.AccountIdAcDashboard,
          BranchesId: this.trialBalanceSelectedFormData.branch,
          ProjectsId: this.trialBalanceSelectedFormData.project,
          ApprovedFilter: "All",
        })
        .subscribe(
          (result) => {
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

  onSubmit() {
    const result: any = this.trialBalanceSelectedForm.instance.validate();

    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.ActivateLoadPanel("Loading Data");
      this.service
        .trailbalanceselected({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          FromDate: this.trialBalanceSelectedFormData.FromDate,
          ToDate: this.trialBalanceSelectedFormData.ToDate,
          GroupAccountId: this.trialBalanceSelectedFormData.account,
          ApprovedFilter: "All",
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            this.accountTitle = this.trialBalanceSelectedForm.instance.getEditor("account").option("text");
            this.dataSource = result;
          },
          (error) => {
            this.DeActivateLoadPanel();
            this.HandleError(error);
          }
        );
    }
  }

  clear() {
    this.initForm();
    this.trialBalanceSelectedForm.instance.getEditor("account").focus();
  }

  onToolPreparingOfItemHistoryGrid = (e) => {
    this.ReportButtonInGridToolbar(e, "Print 113-Register-Report", this.ReportRegister113.bind(this));
    this.ReportButtonInGridToolbar(e, "Print 117-Register-Report", this.ReportRegister117.bind(this));
    this.FilterButtonInGridToolbar(e);
    this.RefreshHistoryGridGrid(() => this.onSubmit.bind(this), this.HistoryGridSateKey("trialbalanceSelectedGrid"), this.trialbalanceSelectedGrid);
  };
}
