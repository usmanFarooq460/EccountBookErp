import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { PurchaseInvoiceTradingService } from "./purchase-invoice-trading-register.service";
import { InventoryCommonService } from "../Inventorycommon.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { PurchaseInvoiceTradingModel } from "./purchase-invoice-trading-register.model";
import notify from "devextreme/ui/notify";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { Router } from "@angular/router";

@Component({
  selector: "app-purchase-invoice-trading-register",
  templateUrl: "./purchase-invoice-trading-register.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class PurchaseInvoiceTradingComponent extends BaseActions implements OnInit {
  @ViewChild("purchaseInvoiceTradingGrid", { static: false })
  purchaseInvoiceTradingGrid: DxDataGridComponent;

  @ViewChild("purchaseInvoiceTradingForm", { static: false })
  purchaseInvoiceTradingForm: DxFormComponent;
  purchaseInvoiceTradingFormData: PurchaseInvoiceTradingModel;
  companyList = [];
  branchList = [];
  projectList = [];
  itemList:any;
  SupplierList:any;
  PurchaseList: [];
  jobLotList: any;
  constructor(private commonMethods:CommonMethodsForCombos,private router:Router,private service: PurchaseInvoiceTradingService) {
    super();
  }


  async ngOnInit() {
    this.breadCrumb("Inventory Reports", "Purchase Invoice Trading Register");
    this.SupplierList=await this.commonMethods.GenerateDataSourceFromList(await  this.commonMethods.SupplierCustomerByOrganizationAndCompany())
    this.itemList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.ItemsGetAll());
    this.jobLotList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.getJobLot());
    
    this.initForm();
  }

  public initForm() {
    this.purchaseInvoiceTradingFormData = new PurchaseInvoiceTradingModel();
    this.purchaseInvoiceTradingFormData.ToDate = new Date();
    this.purchaseInvoiceTradingFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
  }
  

  onSubmit() {
    const result: any = this.purchaseInvoiceTradingForm.instance.validate();
    if (result.isValid == false) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.popoverVisible = false;
      this.ActivateLoadPanel("Loading Data..")
      this.service
        .GetInvoiceRegister({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          DocumentTypeId: 63,
          ToDocNo: this.purchaseInvoiceTradingFormData.ToDocNo,
          FromDocNo: this.purchaseInvoiceTradingFormData.FromDocNo,
          FromDate: this.purchaseInvoiceTradingFormData.FromDate,
          ToDate: this.purchaseInvoiceTradingFormData.ToDate,
          ItemId: this.purchaseInvoiceTradingFormData.ItemId,
          JobLotId: this.purchaseInvoiceTradingFormData.JobLotId,
          SupplierCustomerId: this.purchaseInvoiceTradingFormData.SupplierCustomerId,
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
  }

  ReportRegister229() {
    if (this.purchaseInvoiceTradingFormData) {
      this.service
        .RptPurchaseInvoiceRegister_229({
          //Compulosry
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          DocumentTypeId: 63,
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          ToDocNo: this.purchaseInvoiceTradingFormData.ToDocNo,
          FromDocNo: this.purchaseInvoiceTradingFormData.FromDocNo,
          FromDate: this.purchaseInvoiceTradingFormData.FromDate,
          ToDate: this.purchaseInvoiceTradingFormData.ToDate,
          ItemId: this.purchaseInvoiceTradingFormData.ItemId,
          SupplierCustomerId: this.purchaseInvoiceTradingFormData.SupplierCustomerId,
          ReportName: "229-RptPurchaseInvoiceRegister",
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
          hint: "Print Report-229",
          onClick: this.ReportRegister229.bind(this),
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
      () => this.RefreshHistoryGridGrid(this.dummy.bind(this), this.HistoryGridSateKey("purchaseInvoiceTradingGrid"), this.purchaseInvoiceTradingGrid)
    );
  }
dummy(){}
}
