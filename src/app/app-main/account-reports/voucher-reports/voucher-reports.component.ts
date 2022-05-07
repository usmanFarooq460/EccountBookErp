import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { VoucherReportsService } from "./voucher-reports.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import notify from "devextreme/ui/notify";
import { Router } from "@angular/router";

@Component({
  selector: "app-voucher-reports",
  templateUrl: "./voucher-reports.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class VoucherReportsComponent extends BaseActions implements OnInit {
  @Input() IsLoadedInPopup: boolean = false;
  @ViewChild("voucherReportsGrid", { static: false })
  voucherReportsGrid: DxDataGridComponent;

  @ViewChild("VoucherReportForm", { static: false })
  VoucherReportForm: DxFormComponent;
  VoucherReportFormData: any;
  companyList = [];
  branchList = [];
  projectList = [];
  AccountdocType = [
    { Id: 1, name: "CPV" },
    { Id: 2, name: "BPV" },
    { Id: 3, name: "CRV" },
    { Id: 4, name: "BRV" },
    { Id: 5, name: "JVC" },
    { Id: 203, name: "ExIm-Fcbr" },
  ];
  dataSource = [];
  documentTypeList: any;

  constructor(private router: Router, private service: VoucherReportsService, private commonService: CommonBaseService) {
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
    this.breadCrumb("Account Reports", "Voucher Reports");
    this.ActivateLoadPanel("Initializing!");
    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.DocumentTypesGetAll();
    this.initForm();
    this.DeActivateLoadPanel();
  }

  public initForm() {
    this.VoucherReportFormData = {
      company: this.companyList[0].Id,
      branch: this.branchList[0].Id,
      project: this.projectList[0].Id,
      account: "",
      fromDate: sessionStorage.getItem("StartPeriod"),
      toDate: new Date(),
    };
  }

  DocumentTypesGetAll() {
    this.service.documentType().subscribe(
      (result) => {
        this.documentTypeList = result;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ReportRegister118() {
    if (this.VoucherReportFormData) {
      this.ActivateLoadPanel("Loading Report!");
      this.service
        .AcRptVoucherSlip_118({
          //Compulosry
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.VoucherReportFormData.fromDate,
          ToDate: this.VoucherReportFormData.toDate,
          BranchesId: this.VoucherReportFormData.branch,
          ProjectsId: this.VoucherReportFormData.project,
          ReportName: "118-AcRptVoucherSlip",
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            console.log(result);
            window.open(result);
          },
          (error) => {
            this.DeActivateLoadPanel();
            console.log(error);
            this.HandleError(error);
          }
        );
    }
  }

  onSubmit() {
    const result: any = this.VoucherReportForm.instance.validate();

    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.popoverVisible = false;
      this.ActivateLoadPanel("Loading Data");
      this.service
        .VouchersReport({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          FromDate: this.VoucherReportFormData.fromDate,
          ToDate: this.VoucherReportFormData.toDate,
          DocumentTypeId: this.VoucherReportFormData.documentType,
          ApprovedFilter: "All",
          Id: null,
          IsApproved: "All",
          VoucherCodeF: null,
          VoucherCodeT: null,
          BranchesId: null,
          ProjectsId: null,
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

  clear() {
    // this.VoucherReportForm.instance.resetValues();
    this.VoucherReportFormData.fromDate = sessionStorage.getItem("StartPeriod");
    this.VoucherReportFormData.toDate = new Date();
    this.VoucherReportFormData.documentType = null;
    this.VoucherReportForm.instance.getEditor("documentType").focus();
  }
  goBack() {
    this.router.navigate(["/admin-panel/report-panel"]);
  }

  onToolPreparingOfItemHistoryGrid = (e) => {
    this.ReportButtonInGridToolbar(e, "118-Voucher Report", this.ReportRegister118.bind(this));
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.onSubmit(),
      () => this.RefreshHistoryGridGrid(this.onSubmit.bind(this), this.HistoryGridSateKey("voucherReportsGrid"), this.voucherReportsGrid)
    );
  };
}
