import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { ReceivableService } from "./receivable.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { GlobalConstant } from "src/app/Common/global-constant";
import { Router } from "@angular/router";
@Component({
  selector: "app-receivable",
  templateUrl: "./receivable.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class receivableComponent extends BaseActions implements OnInit {
  @Input() IsLoadedInPopup: boolean = false;
  @ViewChild("ReceiveAbleGrid", { static: false })
  ReceiveAbleGrid: DxDataGridComponent;

  @ViewChild("receivableForm", { static: false })
  receivableForm: DxFormComponent;
  receivableFormData: any;

  companyList = [];
  branchList = [];
  projectList = [];
  dataSource = [];
  dataSourceLength = [];

  constructor(private router: Router, private service: ReceivableService, private commonService: CommonBaseService) {
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
    this.breadCrumb("Account Reports", "Receivable");

    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.initForm();
    this.onSubmitOnLoad();
  }

  public initForm() {
    this.receivableFormData = {
      company: this.companyList[0].Id,
      branch: this.branchList[0].Id,
      project: this.projectList[0].Id,
      FromDate: sessionStorage.getItem("StartPeriod"),
      ToDate: new Date(),
    };
    if (GlobalConstant.DateFromAcDashboard && GlobalConstant.DateToAcDashboard) {
      this.receivableFormData.FromDate = GlobalConstant.DateFromAcDashboard;
      this.receivableFormData.ToDate = GlobalConstant.DateToAcDashboard;
    }
  }

  onSubmitOnLoad() {
    this.popoverVisible = false;
    this.ActivateLoadPanel("Loading Data");
    this.service
      .Receivable({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
        FromDate: new Date(this.receivableFormData.FromDate),
        ToDate: new Date(this.receivableFormData.ToDate),
        AccountTypeId: 3,
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          console.log(result);

          this.dataSource = result;
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
    const result: any = this.receivableForm.instance.validate();

    if (!result.isValid) {
      // result.brokenRules[0].validator.focus();
      return;
    } else {
      this.popoverVisible = false;
      this.ActivateLoadPanel("Loading data");
      this.service
        .Receivable({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          FromDate: this.receivableFormData.FromDate,
          ToDate: this.receivableFormData.ToDate,
          AccountTypeId: 3,
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            this.dataSource = result.filter(({ ClDebit }) => ClDebit > 0);
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

  clear() {
    // this.receivableForm.instance.resetValues();
    this.receivableFormData.FromDate = sessionStorage.getItem("StartPeriod");
    this.receivableFormData.ToDate = new Date();
    this.receivableForm.instance.getEditor("FromDate").focus();
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
        icon: "back",
        hint: "Back",
        onClick: this.goBack.bind(this),
      },
    });

    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.onSubmitOnLoad(),
      () => this.RefreshHistoryGridGrid(this.onSubmitOnLoad.bind(this), this.HistoryGridSateKey("ReceiveAbleGrid"), this.ReceiveAbleGrid)
    );
  };
}
