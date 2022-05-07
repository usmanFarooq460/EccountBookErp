import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { AccountStatmentService } from "./account-statement.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { Router } from "@angular/router";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-account-statement",
  templateUrl: "./account-statement.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class AccountStatementComponent extends BaseActions implements OnInit {
  @Input() IsLoadedInPopup: boolean = false;
  @ViewChild("accountStatmentGrid", { static: false })
  accountStatmentGrid: DxDataGridComponent;

  @ViewChild("accountStatementForm", { static: false })
  accountStatementForm: DxFormComponent;
  accountStatementFormData: any;

  companyList = [];
  branchList = [];
  projectList = [];
  accountList: any = [];
  dataSource = [];
  AccountTitle: string = "";

  // readonly allowedPageSizes = [20, 50, "all"];
  // readonly displayModes = [
  //   { text: "Display Mode 'full'", value: "full" },
  //   { text: "Display Mode 'compact'", value: "compact" },
  // ];
  // displayMode = "full";
  // showPageSizeSelector = true;
  // showInfo = true;
  // showNavButtons = true;
  // customizeColumns(columns) {
  //   columns[0].width = 70;
  // }
  // get isCompactMode() {
  //   return this.displayMode === "compact";
  // }

  constructor(private commonMethods: CommonMethodsForCombos, private router: Router, private service: AccountStatmentService, private commonService: CommonBaseService) {
    super();
  }

  async ngOnInit() {
    this.breadCrumb("Account Reports", "Account Statement");
    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.accountList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.CoaAllocationGetAll());
    this.filtering();
    this.initForm();
  }

  public initForm() {
    this.accountStatementFormData = {
      company: this.companyList[0].Id,
      branch: this.branchList[0].Id,
      project: this.projectList[0].Id,
      fromDate: sessionStorage.getItem("StartPeriod"),
      toDate: new Date(),
    };
  }

  onSubmit() {
    const result: any = this.accountStatementForm.instance.validate();

    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.AccountTitle = this.accountStatementForm.instance.getEditor("account").option("text");
      this.popoverVisible = false;
      this.ActivateLoadPanel("Loading Data");
      this.service
        .accountstatement({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          FromDate: this.accountStatementFormData.fromDate,
          ToDate: this.accountStatementFormData.toDate,
          AccountId: this.accountStatementFormData.account,
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

  ReportRegister109() {
    this.ActivateLoadPanel("Loading Report");
    if (this.accountStatementFormData) {
      this.service
        .AcRptGeneralLedgerStatement_109({
          //Compulosry
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.accountStatementFormData.fromDate,
          ToDate: this.accountStatementFormData.toDate,
          AccountId: this.accountStatementFormData.account,

          ReportName: "109-AcRptGeneralLedgerStatement",
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
      this.ErrorPopup("Record not Found");
      // notify("Record Not Found", "error");
    }
  }

  fileSelected(event: any) {
    // var file = event.target.files["Downloads/doc.pdf"];
    var file = event.target.files[0];
    var fileURL = URL.createObjectURL(file);
    window.open(fileURL);
    //Step 2: Read the file using file reader
    var fileReader = new FileReader();
  }
  clear() {
    let filepath: string;
    this.accountStatementFormData.account = null;
    (this.accountStatementFormData.fromDate = sessionStorage.getItem("StartPeriod")), (this.accountStatementFormData.toDate = new Date());
    this.accountStatementForm.instance.getEditor("account").focus();
  }
  onToolPreparingOfItemHistoryGrid = (e) => {
    this.ReportButtonInGridToolbar(e, "Print 109-Report", this.ReportRegister109.bind(this)), this.FilterButtonInGridToolbar(e);
    this.RefreshHistoryGridGrid(() => this.onSubmit.bind(this), this.HistoryGridSateKey("accountStatmentGrid"), this.accountStatmentGrid);
  };
}
