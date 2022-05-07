import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { PayableService } from "./payable.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { GlobalConstant } from "src/app/Common/global-constant";
import notify from "devextreme/ui/notify";
import { Router } from "@angular/router";
@Component({
  selector: "app-payable",
  templateUrl: "./payable.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class PayableComponent extends BaseActions implements OnInit {
  @Input() IsLoadedInPopup: boolean = false;
  @ViewChild("payAbleGrid", { static: false })
  payAbleGrid: DxDataGridComponent;

  @ViewChild("payableForm", { static: false })
  payableForm: DxFormComponent;
  payableFormData: any;

  companyList = [];
  branchList = [];
  projectList = [];
  dataSource = [];
  dataSourceLength = [];

  constructor(private router: Router, private service: PayableService, private commonService: CommonBaseService) {
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
    this.breadCrumb("Account Reports", "Payable");
    this.ActivateLoadPanel("Initializing!");
    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.initForm();
    this.DeActivateLoadPanel();
    this.OnLoadSubmit();
  }

  public initForm() {
    this.payableFormData = {
      company: this.companyList[0].Id,
      branch: this.branchList[0].Id,
      project: this.projectList[0].Id,
      FromDate: sessionStorage.getItem("StartPeriod"),
      ToDate: new Date(),
    };
    if (GlobalConstant.DateFromAcDashboard && GlobalConstant.DateToAcDashboard) {
      this.payableFormData.FromDate = GlobalConstant.DateFromAcDashboard;
      this.payableFormData.ToDate = GlobalConstant.DateToAcDashboard;
    }
  }

  OnLoadSubmit() {
    this.popoverVisible = false;
    this.ActivateLoadPanel("Loading Data");
    this.service
      .payable({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
        FromDate: this.payableFormData.FromDate,
        ToDate: this.payableFormData.ToDate,
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.dataSource = result.filter(({ ClCredit }) => ClCredit > 0);
          this.dataSourceLength = [50, 100, this.dataSource.length];
          // this.dataSource = result.filter(({ CurrCredit, CurrDebit }) => CurrCredit > 0 || CurrDebit > 0);
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

  onSubmit() {
    const result: any = this.payableForm.instance.validate();

    if (!result.isValid) {
      // result.brokenRules[0].validator.focus();
      return;
    } else {
      this.popoverVisible = false;
      this.ActivateLoadPanel("Loading Data");
      this.service
        .payable({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          FromDate: this.payableFormData.FromDate,
          ToDate: this.payableFormData.ToDate,
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            this.dataSource = result.filter(({ ClCredit }) => ClCredit > 0);
            this.dataSourceLength = [50, 100, this.dataSource.length];
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

  ReportRegister121() {
    if (this.payableFormData) {
      this.ActivateLoadPanel("Loading Report!");
      this.service
        .Accounts_Payables_Rpt_121({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          FinancialYearId: sessionStorage.getItem("FinancialYearId"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.payableFormData.FromDate,
          ToDate: this.payableFormData.ToDate,
          ReportName: "121-Accounts_Payables_Rpt",
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
    // this.payableForm.instance.resetValues();
    this.payableFormData.FromDate = sessionStorage.getItem("StartPeriod");
    this.payableFormData.ToDate = new Date();
    this.payableForm.instance.getEditor("FromDate").focus();
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
        hint: "Print 121-Report",
        onClick: this.ReportRegister121.bind(this),
      },
    });
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.OnLoadSubmit(),
      () => this.RefreshHistoryGridGrid(this.OnLoadSubmit.bind(this), this.HistoryGridSateKey("payAbleGrid"), this.payAbleGrid)
    );
  };
}
