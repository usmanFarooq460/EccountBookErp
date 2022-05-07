import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { PayableAgingService } from "./payable-aging.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import notify from "devextreme/ui/notify";
import { Router } from "@angular/router";

@Component({
  selector: "app-payable-aging",
  templateUrl: "./payable-aging.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class PayableAgingComponent extends BaseActions implements OnInit {
  @Input() IsLoadedInPopup: boolean = false;
  @ViewChild("payableAgingGrid", { static: false })
  payableAgingGrid: DxDataGridComponent;

  @ViewChild("receivableAgingForm", { static: false })
  receivableAgingForm: DxFormComponent;
  receivableAgingFormData: any;

  companyList = [];
  branchList = [];
  projectList = [];
  dataSource = [];

  constructor(private router: Router, private service: PayableAgingService, private commonService: CommonBaseService) {
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
    this.breadCrumb("Account Reports", "Payable Aging");
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
      this.ActivateLoadPanel("Loading Data");
      this.service
        .payableaging({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          EndDate: this.receivableAgingFormData.endDate,
          IntervalDays: this.receivableAgingFormData.intervalDays,
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            this.dataSource = result;
            let noOfRecord: number;
            noOfRecord = this.dataSource.length;
            // this.notification(noOfRecord + "  " + "Record Found SuccessFully", "success");
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

  ReportRegister120() {
    if (this.receivableAgingFormData) {
      this.service
        .AcRptPayablesAging_120({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          FinancialYearId: sessionStorage.getItem("FinancialYearId"),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          IntervalDays: this.receivableAgingFormData.intervalDays,
          EndDate: this.receivableAgingFormData.endDate,
          ReportName: "120-AcRptPayablesAging",
        })
        .subscribe(
          (result) => window.open(result),
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
    } else {
      this.ErrorPopup("Record Not Found");
      // notify("Record Not Found", "error");
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
    e.toolbarOptions.items.unshift(
      {
        location: "after",
        widget: "dxButton",
        options: {
          id: "outstandingPaddyPurchaseOrderChartButton",
          icon: "print",
          hint: "Print 120-Register-Report",
          onClick: this.ReportRegister120.bind(this),
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
      () => this.onSubmit(),
      () => this.RefreshHistoryGridGrid(this.onSubmit.bind(this), this.HistoryGridSateKey("payableAgingGrid"), this.payableAgingGrid)
    );
  };
}
