import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { VoucherValidationService } from "./voucher-validation.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import notify from "devextreme/ui/notify";
import { Router } from "@angular/router";
@Component({
  selector: "app-voucher-validation",
  templateUrl: "./voucher-validation.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class VoucherValidationComponent extends BaseActions implements OnInit {
  @Input() IsLoadedInPopup: boolean = false;
  @ViewChild("voucherValidationGrid", { static: false })
  voucherValidationGrid: DxDataGridComponent;
  @ViewChild("VoucherValidationForm", { static: false })
  VoucherValidationForm: DxFormComponent;
  VoucherValidationFormData: any;
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
  documentTypeList: any;
  dataSource = [];
  CollectionOfFormComponentVisible: boolean=false;
  DocumentTypeIdForCollectionOfFormsComponent: number=0;
  DocumentIdForCollectionOfFormsComponent: number=0;
  constructor(private router: Router, private service: VoucherValidationService, private commonService: CommonBaseService) {
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
    this.breadCrumb("Account Reports", "Voucher Validation Report");
    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.DocumentTypesGetAll();
    this.initForm();
  }
  public initForm() {
    this.VoucherValidationFormData = {
      company: this.companyList[0].Id,
      branch: this.branchList[0].Id,
      project: this.projectList[0].Id,
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
  handleCollectionOfFormsComponentVisibility(data)
  {
    
    if(this.CollectionOfFormComponentVisible==false)
    {
      console.log("Iniside Voucher Validation Report!")
    console.log(data);
      this.DocumentTypeIdForCollectionOfFormsComponent=data.DocumentTypeId;
      this.DocumentIdForCollectionOfFormsComponent=data.Id;
    }
    this.CollectionOfFormComponentVisible=!this.CollectionOfFormComponentVisible
  }
  onSubmit() {
    const result: any = this.VoucherValidationForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.popoverVisible = false;
      this.ActivateLoadPanel("Loading Data");
      this.service
        .VoucherValidationReport({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          FromDate: this.VoucherValidationFormData.fromDate,
          ToDate: this.VoucherValidationFormData.toDate,
          Id: null,
          VoucherCodeF: null,
          VoucherCodeT: null,
          // DocumentTypeId: 56,
          ApprovedFilter: "All",
          DocumentTypeId: this.VoucherValidationFormData.documentType,
          BranchesId: null,
          ProjectsId: null,
        })
        .subscribe(
          (result) => {
            console.log(result);
            this.dataSource = result;
            this.DeActivateLoadPanel();
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
  ReportRegister115() {
    if (this.VoucherValidationFormData) {
      this.ActivateLoadPanel("Loading Report!");
      this.service
        .AcRptVoucherValidation_115({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          FinancialYearId: sessionStorage.getItem("FinancialYearId"),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.VoucherValidationFormData.fromDate,
          ToDate: this.VoucherValidationFormData.toDate,
          DocumentTypeId: this.VoucherValidationFormData.documentType,
          ReportName: "115-AcRptVoucherValidation",
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
  ReportRegister119() {
    if (this.VoucherValidationFormData) {
      this.ActivateLoadPanel("Loading Report");
      this.service
        .AcRptVoucherValidation2_119({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          FinancialYearId: sessionStorage.getItem("FinancialYearId"),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.VoucherValidationFormData.fromDate,
          ToDate: this.VoucherValidationFormData.toDate,
          DocumentTypeId: this.VoucherValidationFormData.documentType,
          ReportName: "119-AcRptVoucherValidation2",
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
    this.VoucherValidationFormData.fromDate = sessionStorage.getItem("StartPeriod");
    this.VoucherValidationFormData.toDate = new Date();
    this.VoucherValidationFormData.documentType = null;
    this.VoucherValidationForm.instance.getEditor("documentType").focus();
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
          hint: "Print 115-Report",
          onClick: this.ReportRegister115.bind(this),
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          id: "outstandingPaddyPurchaseOrderChartButton",
          icon: "print",
          hint: "Print 119-Report",
          onClick: this.ReportRegister119.bind(this),
        },
      }
    );
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.onSubmit(),
      () => this.RefreshHistoryGridGrid(this.onSubmit.bind(this), this.HistoryGridSateKey("voucherValidationGrid"), this.voucherValidationGrid)
    );
  };
}
