import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { GeneralLedgerService } from "./general-ledger.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";

import DataSource from "devextreme/data/data_source";
import { Router } from "@angular/router";
import { GenerealLedgerModel } from "./general-ledger.model";

import { validate } from "src/app/shared/Base/validationHelper";
import { bounceInDownOnEnterAnimation, bounceOutDownOnLeaveAnimation } from "angular-animations";

@Component({
  selector: "app-general-ledger",
  templateUrl: "./general-ledger.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
  animations: [bounceInDownOnEnterAnimation({ anchor: "bounceInDown", duration: 600, delay: 100 }), bounceOutDownOnLeaveAnimation({ anchor: "bounceOutDown", duration: 600, delay: 50 })],
})
export class GeneralLedgerComponent extends BaseActions implements OnInit {
  @Input() IsLoadedInPopup: boolean = false;
  @ViewChild("GeneralLedgerDetailRptGrid", { static: false })
  GeneralLedgerDetailRptGrid: DxDataGridComponent;
  @ViewChild("GeneralLedgerSummary_IRptGrid", { static: false })
  GeneralLedgerSummary_IRptGrid: DxDataGridComponent;
  @ViewChild("GeneralLedgerSummary_IIRptGrid", { static: false })
  GeneralLedgerSummary_IIRptGrid: DxDataGridComponent;

  @ViewChild("generalLedgerSummaryForm", { static: false })
  generalLedgerSummaryForm: DxFormComponent;
  generalLedgerSummaryFormData: GenerealLedgerModel;

  companyList = [];
  branchList = [];
  projectList = [];
  accountList: any = [];
  dataSource = [];
  critarea: string;
  Accounttitle: string = "";
  //========================================================
  GeneralLedgerDetailRptValue: boolean = false;
  GeneralLedgerSummary_IRptValue: boolean = false;
  GeneralLedgerSummary_IIRptValue: boolean = false;
  GeneralLedgerDetailRptDataSource = [];
  GeneralLedgerDetailSummary_IRptDataSource = [];
  GeneralLedgerDetailSummary_IIRptDataSource = [];

  //========================================================
  constructor(private router: Router, private service: GeneralLedgerService, private commonService: CommonBaseService) {
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
    this.breadCrumb("Account Reports", "General Ledger");
    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.account();

    this.initForm();
  }

  public initForm() {
    this.generalLedgerSummaryFormData = new GenerealLedgerModel();
    this.generalLedgerSummaryFormData.fromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.generalLedgerSummaryFormData.toDate = new Date();
    this.generalLedgerSummaryFormData.company = parseInt(sessionStorage.getItem("CompanyId"));
    this.generalLedgerSummaryFormData.branch = this.branchList[0].Id;
    this.generalLedgerSummaryFormData.project = this.projectList[0].Id;
    this.GeneralLedgerDetailRptValue = true;
    this.critarea = "";
  }

  //==================================================
  handleSwithcValueChange = (e, swithcName) => {
    if (swithcName == "GeneralLedgerDetailRpt") {
      this.GeneralLedgerSummary_IRptValue = false;
      this.GeneralLedgerSummary_IRptValue = false;
    } else if (swithcName == "GeneralLedgerSummary_IRpt") {
      this.GeneralLedgerDetailRptValue = false;
      this.GeneralLedgerSummary_IIRptValue = false;
    } else if (swithcName == "GeneralLedgerSummary_IIRpt") {
      this.GeneralLedgerDetailRptValue = false;
      this.GeneralLedgerSummary_IRptValue = false;
    }
    this.GeneralLedgerDetailRptDataSource = [];
    this.GeneralLedgerDetailSummary_IRptDataSource = [];
    this.GeneralLedgerDetailSummary_IIRptDataSource = [];
  };
  async GeneralLedgerDetailRpt() {
    return await this.service
      .GeneralLedgerDetailRpt({
        FinancialYearId: sessionStorage.getItem("FinancialYearId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: this.generalLedgerSummaryFormData.company,
        BranchesId: this.generalLedgerSummaryFormData.branch,
        ProjectsId: this.generalLedgerSummaryFormData.project,
        FromDate: this.generalLedgerSummaryFormData.fromDate,
        ToDate: this.generalLedgerSummaryFormData.toDate,
        AccountId: this.generalLedgerSummaryFormData.account,
        ApprovedFilter: "All",
      })
      .catch((error) => this.HandleError(error));
  }
  async GeneralLedgerSummary_IRpt() {
    return await this.service
      .GeneralLedgerSummary_IRpt({
        FinancialYearId: sessionStorage.getItem("FinancialYearId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: this.generalLedgerSummaryFormData.company,
        BranchesId: this.generalLedgerSummaryFormData.branch,
        ProjectsId: this.generalLedgerSummaryFormData.project,
        FromDate: this.generalLedgerSummaryFormData.fromDate,
        ToDate: this.generalLedgerSummaryFormData.toDate,
        AccountId: this.generalLedgerSummaryFormData.account,
        ApprovedFilter: "All",
      })
      .catch((error) => this.HandleError(error));
  }
  async GeneralLedgerSummary_IIRpt() {
    return await this.service
      .GeneralLedgerSummary_IIRpt({
        FinancialYearId: sessionStorage.getItem("FinancialYearId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: this.generalLedgerSummaryFormData.company,
        FromDate: this.generalLedgerSummaryFormData.fromDate,
        ToDate: this.generalLedgerSummaryFormData.toDate,
        AccountId: this.generalLedgerSummaryFormData.account,
        ApprovedFilter: "All",
      })
      .catch((error) => this.HandleError(error));
  }

  //==================================================
  formatValue(e) {
    if (e > 0) {
      return parseFloat(e.toFixed(2));
    } else if (e < 0) {
      let c = Math.abs(parseFloat(e.toFixed(2)));
      return "(" + c + ")";
    }
    return e;
  }
  account() {
    this.service
      .CoaAccounts({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          // this.accountList = result;
          console.log(result);
          this.accountList = new DataSource({
            store: result,
            loadMode: "raw",
            paginate: true,
            pageSize: 10,
          });
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

  async onSubmit() {
    let data = [];
    this.ActivateLoadPanel("loading Data");
    if (validate(this.generalLedgerSummaryForm)) {
      if (this.GeneralLedgerDetailRptValue == true) {
        data = await this.GeneralLedgerDetailRpt();
        console.log(data);
        this.GeneralLedgerDetailRptDataSource = data;
      } else if (this.GeneralLedgerSummary_IRptValue == true) {
        data = await this.GeneralLedgerSummary_IRpt();
        console.log(data);
        this.GeneralLedgerDetailSummary_IRptDataSource = data;
      } else if (this.GeneralLedgerSummary_IIRptValue == true) {
        data = await this.GeneralLedgerSummary_IIRpt();
        this.GeneralLedgerDetailSummary_IIRptDataSource = data;
      }
    }
    this.DeActivateLoadPanel();

    this.Accounttitle = this.generalLedgerSummaryForm.instance.getEditor("account").option("text");
  }

  pdfReportViewer() {
    const result: any = this.generalLedgerSummaryForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.popoverVisible = false;
      this.ActivateLoadPanel("Loading Report!");
      this.service
        .pdfgeneralLedger({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          FromDate: this.generalLedgerSummaryFormData.fromDate,
          ToDate: this.generalLedgerSummaryFormData.toDate,
          AccountId: this.generalLedgerSummaryFormData.account,
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          ReportName: "105-AcRptGeneralLedger",
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
  customizeText(options) {
    // console.log(options.valueText);
    //  return options.valueText;
    var absValue = Math.abs(options.valueText);
    // var returnString = Number(absValue).toLocaleString(currencyLocale, {
    //   minimumFractionDigits: 2,
    // });

    return options.valueText < 0 ? "(" + options.valueText + ")" : options.valueText;
  }

  ReportRegister105() {
    if (this.generalLedgerSummaryFormData) {
      this.ActivateLoadPanel("Loading Report !");
      this.service
        .AcRptGeneralLedger_105({
          //Compulosry
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          FromDate: this.generalLedgerSummaryFormData.fromDate,
          ToDate: this.generalLedgerSummaryFormData.toDate,
          AccountId: this.generalLedgerSummaryFormData.account,
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),

          ReportName: "105-AcRptGeneralLedger",
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
      // notify("Record Not Found", "error");
    }
  }

  ReportRegister106() {
    if (this.generalLedgerSummaryFormData) {
      this.ActivateLoadPanel("Loading Report!");
      this.service
        .AcRptGeneralLedgerB_106({
          //Compulosry
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          FromDate: this.generalLedgerSummaryFormData.fromDate,
          ToDate: this.generalLedgerSummaryFormData.toDate,
          AccountId: this.generalLedgerSummaryFormData.account,
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),

          ReportName: "106-AcRptGeneralLedgerB",
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

  ReportRegister107() {
    if (this.generalLedgerSummaryFormData) {
      this.ActivateLoadPanel("Loading Report!");
      this.service
        .AcRptQuantativeLedger_107({
          //Compulosry
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          FromDate: this.generalLedgerSummaryFormData.fromDate,
          ToDate: this.generalLedgerSummaryFormData.toDate,
          AccountId: this.generalLedgerSummaryFormData.account,
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),

          ReportName: "107-AcRptQuantativeLedger",
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

  ReportRegister108() {
    if (this.generalLedgerSummaryFormData) {
      this.ActivateLoadPanel("Loading Report");
      this.service
        .AcRptGeneralLedgerSummery_108({
          //Compulosry
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          FromDate: this.generalLedgerSummaryFormData.fromDate,
          ToDate: this.generalLedgerSummaryFormData.toDate,
          AccountId: this.generalLedgerSummaryFormData.account,
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),

          ReportName: "108-AcRptGeneralLedgerSummery",
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
      // notify("Record Not Found", "error");
    }
  }

  clear() {
    // this.generalLedgerSummaryForm.instance.resetValues();
    (this.generalLedgerSummaryFormData.fromDate = new Date(sessionStorage.getItem("StartPeriod"))),
      (this.generalLedgerSummaryFormData.toDate = new Date()),
      (this.generalLedgerSummaryFormData.account = null),
      this.generalLedgerSummaryForm.instance.getEditor("account").focus();
  }

  goBack() {
    this.router.navigate(["/admin-panel/report-panel"]);
  }
  DummyMethod() {}
  GeneralLedgerDetailRptGridToolbar = (e) => {
    this.FilterButtonInGridToolbar(e);
    this.RefreshButtonInGridToolbar(e, () =>
      this.RefreshHistoryGridGrid(() => this.DummyMethod.bind(this), this.HistoryGridSateKey("GeneralLedgerDetailRptGridState"), this.GeneralLedgerDetailRptGrid)
    );
    this.ReportButtonInGridToolbar(e, "106_GeneralLedgerReport", this.ReportRegister106.bind(this));
    this.ReportButtonInGridToolbar(e, "107_GeneralLedgerReport", this.ReportRegister107.bind(this));
    // this.ReportButtonInGridToolbar(e, "108-GenerealLedgerRegister", this.ReportRegister108.bind(this));
    this.ReportButtonInGridToolbar(e, "105-GenerealLedgerReport", this.ReportRegister105.bind(this));
  };
  GeneralLedgerSummary_IRptGridToolbar = (e) => {
    this.FilterButtonInGridToolbar(e);
    this.RefreshButtonInGridToolbar(e, () =>
      this.RefreshHistoryGridGrid(() => this.DummyMethod.bind(this), this.HistoryGridSateKey("GeneralLedgerSummary_IRptGridToolbar"), this.GeneralLedgerDetailRptGrid)
    );
    this.ReportButtonInGridToolbar(e, "106_GeneralLedgerReport", this.ReportRegister106.bind(this));
    this.ReportButtonInGridToolbar(e, "107_GeneralLedgerReport", this.ReportRegister107.bind(this));
  };
  GeneralLedgerSummary_IIRptGridToolbar = (e) => {
    this.FilterButtonInGridToolbar(e);
    this.RefreshButtonInGridToolbar(e, () =>
      this.RefreshHistoryGridGrid(() => this.DummyMethod.bind(this), this.HistoryGridSateKey("GeneralLedgerSummary_IIRptGridState"), this.GeneralLedgerDetailRptGrid)
    );
    this.ReportButtonInGridToolbar(e, "106_GeneralLedgerReport", this.ReportRegister106.bind(this));
    this.ReportButtonInGridToolbar(e, "107_GeneralLedgerReport", this.ReportRegister107.bind(this));
  };
}
