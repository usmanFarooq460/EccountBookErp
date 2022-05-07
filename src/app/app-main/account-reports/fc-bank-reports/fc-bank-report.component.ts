import { Component, HostListener, AfterViewInit, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { FcBankService } from "./fc-bank-report.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { FcBankModel } from "./fc-bank-report.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-fc-bankReport",
  templateUrl: "./fc-bank-report.component.html",
  styleUrls: ["./fc-bank-report.scss", "/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class FcBankReport extends BaseActions implements OnInit {
  @ViewChild("fcBankReportGrid", { static: false })
  fcBankReportGrid: DxDataGridComponent;

  @ViewChild("FcBankRptForm", { static: false })
  FcBankRptForm: DxFormComponent;
  FcBankRptFormData: FcBankModel;

  dataSource = [];
  ItemList = [];
  ItemTypelist = [];
  ItemCategoryList = [];
  SupplierList: any = [];
  WareHouseList = [];
  branchList = [];
  projectList = [];
  contractList = [];
  bankList = [];
  ReportInfo: string;
  //======================================

  constructor(private router: Router, private service: FcBankService, private commonService: CommonBaseService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.popoverVisible = false;
    this.filter = false;
  }

  toggle() {
    this.popoverVisible = !this.popoverVisible;
  }

  async ngOnInit() {
    this.breadCrumb("Acconts Reports", "Fcy Bank Report");
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.SupplierList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.SupplierCustomerForExport());
    this.filtering();
    this.initForm();
    this.ContracListGet();
    this.BankListGet();
    this.onSubmit();
  }
  initForm() {
    this.FcBankRptFormData = new FcBankModel();
    this.FcBankRptFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.FcBankRptFormData.ToDate = new Date();
  }

  clear() {
    this.initForm();
  }
  onToolPreparingOfItemHistoryGrid = (e) => {
    this.ReportButtonInGridToolbar(e, "517-Fcy Bank", this.ReportRegister517.bind(this));
    this.FilterButtonInGridToolbar(e);
    this.RefreshHistoryGridGrid(() => this.onSubmit.bind(this), this.HistoryGridSateKey("fcBankReportGrid"), this.fcBankReportGrid);
  };

  ContracListGet() {
    this.service
      .LcOrderNoGetAll({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.contractList = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  BankListGet() {
    this.service
      .CoaAccounts({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.bankList = result.filter(({ AccountTypeId }) => AccountTypeId == 15);
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  FcBankSlip516(e) {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .EximBankReceipt_516({
        Id: e.Id,
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "516-ExImRptFCBankReceipts",
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
  onPrintVoucher(e) {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .getFcyVoucherPdfReport({
        Id: e.VoucherHeadId,
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        DocumentTypeId: 203,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ApprovedFilter: "All",
        ReportName: "102-AcRptPaymentReceiptsVoucherSlip",
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
  ReportRegister517() {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .PdfRegisterReport_517({
        //Compulosry
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        FromDate: this.FcBankRptFormData.FromDate,
        ToDate: this.FcBankRptFormData.ToDate,
        SupplierCustomerId: this.FcBankRptFormData.SupplierCustomerId,
        OrderId: this.FcBankRptFormData.OrderId,
        AccountId: this.FcBankRptFormData.AccountId,
        ReportName: "517-EximRptFcBankReceiptRegister",
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

  GenereateReportInforArray() {
    return [
      { ParameterName: "Supplier/Customer", ParameterValue: this.FcBankRptForm.instance.getEditor("SupplierCustomerId").option("text") },
      { ParameterName: "Contract", ParameterValue: this.FcBankRptForm.instance.getEditor("OrderId").option("text") },
      { ParameterName: "Bank", ParameterValue: this.FcBankRptForm.instance.getEditor("AccountId").option("text") },
      { ParameterName: "From", ParameterValue: this.FcBankRptFormData.FromDate.toLocaleDateString() },
      { ParameterName: "To", ParameterValue: this.FcBankRptFormData.ToDate.toLocaleDateString() },
    ];
  }
  onSubmit() {
    this.ActivateLoadPanel("Fetching Data");
    console.log(this.FcBankRptFormData);
    this.service.FcBankReportGetAll(this.FcBankRptFormData).subscribe(
      (result) => {
        console.log(result);
        this.DeActivateLoadPanel();
        this.ReportInfo = this.GenereateReportInfoString(this.GenereateReportInforArray());
        this.dataSource = result;
      },
      (error) => {
        this.DeActivateLoadPanel();
        this.HandleError(error);
      }
    );
  }
}
