import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { SaleInvoiceTradingService } from "./Sale-invoice-trading-register.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { SaleInvoiceTradingModel } from "./Sale-invoice-trading-register.model";
import { Router } from "@angular/router";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-Sale-invoice-trading-register",
  templateUrl: "./Sale-invoice-trading-register.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class SaleInvoiceTradingComponent extends BaseActions implements OnInit {
  @ViewChild("SaleInvoiceTrading", { static: false })
  SaleInvoiceTrading: DxDataGridComponent;

  @ViewChild("purchaseInvoiceTradingForm", { static: false })
  SaleInvoiceTradingForm: DxFormComponent;
  SaleInvoiceTradingFormData: SaleInvoiceTradingModel;
  companyList = [];
  branchList = [];
  projectList = [];
  itemList: any;
  SupplierList: any;
  PurchaseList: [];
  constructor(
    private commonMethods: CommonMethodsForCombos,
    private router: Router,
    private service: SaleInvoiceTradingService,
    private commonService: CommonBaseService,
  ) {
    super();
  }

  async ngOnInit() {
    this.breadCrumb("Inventory Reports", "Purchase Invoice Trading Register");

    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.SupplierList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.SupplierCustomerByOrganizationAndCompany());
    this.itemList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.ItemsGetAll());
    this.initForm();
  }

  public initForm() {
    this.SaleInvoiceTradingFormData = new SaleInvoiceTradingModel();
    this.SaleInvoiceTradingFormData.ToDate = new Date();
    this.SaleInvoiceTradingFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
  }

  onSubmit() {
    // const result: any = this.SaleInvoiceTradingForm.instance.validate();
    // if (result.isValid == false) {
    //   result.brokenRules[0].validator.focus();
    //   return;
    // } else {
    this.ActivateLoadPanel("Loading Data..");
    this.service
      .GetInvoiceRegister({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        DocumentTypeId: 103,

        ToDocNo: this.SaleInvoiceTradingFormData.ToDocNo,
        FromDocNo: this.SaleInvoiceTradingFormData.FromDocNo,
        FromDate: this.SaleInvoiceTradingFormData.FromDate,
        ToDate: this.SaleInvoiceTradingFormData.ToDate,
        ItemId: this.SaleInvoiceTradingFormData.ItemId,
        SupplierCustomerId: this.SaleInvoiceTradingFormData.SupplierCustomerId,
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.PurchaseList = result;
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

  ReportRegister231() {
    if (this.SaleInvoiceTradingFormData) {
      this.service
        .RptSaleInvoiceRegister_231({
          //Compulosry
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          DocumentTypeId: 103,

          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          ToDocNo: this.SaleInvoiceTradingFormData.ToDocNo,
          FromDocNo: this.SaleInvoiceTradingFormData.FromDocNo,
          FromDate: this.SaleInvoiceTradingFormData.FromDate,
          ToDate: this.SaleInvoiceTradingFormData.ToDate,
          ItemId: this.SaleInvoiceTradingFormData.ItemId,
          SupplierCustomerId: this.SaleInvoiceTradingFormData.SupplierCustomerId,
          ReportName: "231-RptSaleInvoiceRegister",
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
      this.ErrorPopup("Record Not Found")
    }
  }
  clear() {
    this.initForm();
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
          hint: "Print Report-231",
          onClick: this.ReportRegister231.bind(this),
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
      () => this.RefreshHistoryGridGrid(this.onSubmit.bind(this), this.HistoryGridSateKey("SaleInvoiceTrading"), this.SaleInvoiceTrading)
    );
  }
}
