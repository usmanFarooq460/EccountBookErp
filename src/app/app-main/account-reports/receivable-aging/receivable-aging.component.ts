import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { ReceivableAgingService } from "./receivable-aging.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import notify from "devextreme/ui/notify";
import { Router } from "@angular/router";

@Component({
  selector: "app-receivable-aging",
  templateUrl: "./receivable-aging.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class ReceivableAgingComponent extends BaseActions implements OnInit {
  @Input() IsLoadedInPopup: boolean = false;
  @ViewChild("ReceiveAbleAgingGrid", { static: false })
  ReceiveAbleAgingGrid: DxDataGridComponent;

  @ViewChild("receivableAgingForm", { static: false })
  receivableAgingForm: DxFormComponent;
  receivableAgingFormData: any;

  companyList = [];
  branchList = [];
  projectList = [];
  dataSource = [];

  constructor(private router: Router, private service: ReceivableAgingService, private commonService: CommonBaseService) {
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
    this.breadCrumb("Account Reports", "Receivable Aging");
    this.ActivateLoadPanel("Initializing!");
    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.initForm();
    this.DeActivateLoadPanel();
  }

  public initForm() {
    this.receivableAgingFormData = {
      company: this.companyList[0].Id,
      branch: this.branchList[0].Id,
      project: this.projectList[0].Id,
      intervalDays: "10",
      endDate: new Date(),
    };
  }

  onSubmit() {
    const result: any = this.receivableAgingForm.instance.validate();

    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.popoverVisible = false;
      this.ActivateLoadPanel("Loading Data!");
      this.service
        .receivableaging({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          EndDate: this.receivableAgingFormData.endDate,
          IntervalDays: this.receivableAgingFormData.intervalDays,
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            console.log(result);
            this.dataSource = result;
          },
          (error) => {
            this.DeActivateLoadPanel();
            this.HandleError(error);
          }
        );
    }
  }

  ReportRegister111() {
    if (this.receivableAgingFormData) {
      this.ActivateLoadPanel("Loading Report!");
      this.service
        .AcRptReceivablesAging_111({
          //Compulosry
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          IntervalDays: this.receivableAgingFormData.intervalDays,
          EndDate: this.receivableAgingFormData.endDate,

          ReportName: "111-AcRptReceivablesAging",
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
  }

  clear() {
    // this.receivableAgingForm.instance.resetValues();
    this.receivableAgingFormData.intervalDays = "10";
    this.receivableAgingFormData.endDate = new Date();
    this.receivableAgingForm.instance.getEditor("endDate").focus();
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
        hint: "Print 111-Register-Report",
        onClick: this.ReportRegister111.bind(this),
      },
    });

    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.onSubmit(),
      () => this.RefreshHistoryGridGrid(this.onSubmit.bind(this), this.HistoryGridSateKey("ReceiveAbleAgingGrid"), this.ReceiveAbleAgingGrid)
    );
  };
}
