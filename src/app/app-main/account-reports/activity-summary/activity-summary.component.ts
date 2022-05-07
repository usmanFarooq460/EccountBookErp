import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { ActivitySummaryService } from "./activity-summary.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { AccountsDashboardComponent } from "../../dashboard/accounts-dashboard";
import { AccountsReportsModel } from "../accounts-reports.model";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { MostUsedMethods, CompanyInfo } from "src/app/shared/Base/mostUsedMethods";
import { ActivityModel } from "./activity-summary.model";

@Component({
  selector: "app-activity-summary-report",
  templateUrl: "./activity-summary.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class ActivitySummaryComponent extends BaseActions implements OnInit {
  @ViewChild("summaryActivityGrid", { static: false })
  summaryActivityGrid: DxDataGridComponent;
  @ViewChild("activitySummaryForm", { static: false })
  activitySummaryForm: DxFormComponent;
  activitySummaryFormData: ActivityModel;

  companyList = [];
  branchList = [];
  projectList = [];
  dataSource = [];
  //=============================================
  @Input() CompanyId: number;
  @Input() FromDate: Date;
  @Input() ToDate: Date;
  @Input() AccountTypIds: string;
  @Input() IsLoadedInPopup: boolean = false;

  mostUsedMethods: any;
  CommpanyData: CompanyInfo;
  constructor(private service: ActivitySummaryService, private commonMethods: CommonMethodsForCombos, private commonService: CommonBaseService, private DashboardData: AccountsDashboardComponent) {
    super();
    this.mostUsedMethods = new MostUsedMethods(commonMethods);
  }

  async ngOnInit() {
    this.initForm();
    await this.FetchHistoryData();
  }

  public initForm() {
    this.activitySummaryFormData = new ActivityModel();
    this.activitySummaryFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.activitySummaryFormData.ToDate = new Date();
  }

  async FetchHistoryData() {
    this.activitySummaryFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
    this.activitySummaryFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
    this.activitySummaryFormData.FinancialYearId = parseInt(sessionStorage.getItem("FinancialYearId"));
    this.activitySummaryFormData.BranchesId = null;
    this.activitySummaryFormData.ProjectsId = null;
    this.activitySummaryFormData.IsApproved = "All";
    this.ActivateLoadPanel("Fetching Data!");
    this.dataSource = await this.GetActivitySummary(this.activitySummaryFormData);
    this.DeActivateLoadPanel();
  }
  async GetActivitySummary(data) {
    return await this.service.activitySummary(data).catch((err) => this.HandleError(err));
  }

  async ReportRegister110() {
    this.ActivateLoadPanel("Loading Report");
    if (this.activitySummaryFormData) {
      this.service
        .AcRptActivitySummery_110({
          //Compulosry
          OrganizationId: sessionStorage.getItem("CompanyId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.activitySummaryFormData.FromDate,
          ToDate: this.activitySummaryFormData.ToDate,
          FinancialYearId: sessionStorage.getItem("FinancialYearId"),
          ReportName: "110-AcRptActivitySummery",
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
      this.ErrorPopup("Record Not Found ");
    }
  }

  ReportRegister116() {
    this.ActivateLoadPanel("Loading Data");
    if (this.activitySummaryFormData) {
      this.service
        .AcRptAccountsActivityDetail_116({
          OrganizationId: sessionStorage.getItem("CompanyId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.activitySummaryFormData.FromDate,
          ToDate: this.activitySummaryFormData.ToDate,
          ReportName: "116-AcRptAccountsActivityDetail",
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

  DummyMethod() {}
  onToolPreparingOfItemHistoryGrid = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("summaryActivityGrid"), this.summaryActivityGrid));
    this.FilterButtonInGridToolbar(e);
    this.ReportButtonInGridToolbar(e, "Print Report 110", this.ReportRegister110.bind(this));
    this.ReportButtonInGridToolbar(e, "Print Report 116", this.ReportRegister116.bind(this));
  };
}
