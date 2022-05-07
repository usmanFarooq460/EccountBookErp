import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { SaleInvoiceHistoryService } from "./sale-invoice-history.service";
import { InventoryCommonService } from "../Inventorycommon.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { SaleInvoiceHistoryModel } from "./sale-invoice-history.model";
import notify from "devextreme/ui/notify";
import { Router } from "@angular/router";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-sale-invoice-history",
  templateUrl: "./sale-invoice-history.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class SaleInvoiceHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("SaleInvoiceHistoryGrid", { static: false })
  SaleInvoiceHistoryGrid: DxDataGridComponent;

  @ViewChild("SaleInvoiceHistoryForm", { static: false })
  SaleInvoiceHistoryForm: DxFormComponent;
  SaleInvoiceHistoryFormData: SaleInvoiceHistoryModel;

  companyList = [];
  branchList = [];
  projectList = [];
  SupplierList:any;
  dataSource = [];
  ItemList :any;

  constructor(private commonMethods:CommonMethodsForCombos,private router:Router,private service: SaleInvoiceHistoryService, private commonService: CommonBaseService, private inventorycommon_service: InventoryCommonService) {
    super();
  }

  setFocus = () => this.SaleInvoiceHistoryForm.instance.getEditor("SupplierCustomerId").focus();
  

  async ngOnInit() {
    this.breadCrumb("Inventory Reports", "Sale-Invoice-History");
    this.SupplierList=await this.commonMethods.GenerateDataSourceFromList(await  this.commonMethods.SupplierCustomerByOrganizationAndCompany())
    this.ItemList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.ItemsGetAll());
    this.initForm();
  }
  public initForm() {
    this.SaleInvoiceHistoryFormData = new SaleInvoiceHistoryModel();
    this.SaleInvoiceHistoryFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.SaleInvoiceHistoryFormData.ToDate = new Date();
    this.onLoad();
  }
  

  ReportRegister206() {
    if (this.SaleInvoiceHistoryFormData) {
      this.service
        .RptInvSaleInvoiceRegister_226({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.SaleInvoiceHistoryFormData.FromDate,
          ToDate: this.SaleInvoiceHistoryFormData.ToDate,
          FromDocNo: this.SaleInvoiceHistoryFormData.FromDocNo,
          ToDocNo: this.SaleInvoiceHistoryFormData.ToDocNo,
          SupplierCustomerId: this.SaleInvoiceHistoryFormData.SupplierCustomerId,
          ItemId: this.SaleInvoiceHistoryFormData.ItemId,
          ReportName: "226-RptInvSaleInvoiceRegister",
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
      this.ErrorPopup("Record Not Found ")
    }
  }

  ReportSlip301 = (e) => {
    if (this.SaleInvoiceHistoryFormData) {
      this.service
        .InvSaleInvoiceCustomerBillReport301({
          Id: e.Id,
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDocNo: this.SaleInvoiceHistoryFormData.FromDocNo,
          DocumentTypeId: 95,
          ToDocNo: this.SaleInvoiceHistoryFormData.ToDocNo,
          ReportName: "301-InvRepSaleBillCustomer",
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
  };

  ReportVoucher103 = (e) => {
    if (this.SaleInvoiceHistoryFormData) {
      this.service
        .AcRptPurchaseSalesVoucherSlip_103({
          Id: e.Id,
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          FromDocNo: this.SaleInvoiceHistoryFormData.FromDocNo,
          DocumentTypeId: 95,
          ApprovedFilter: "All",
          ToDocNo: this.SaleInvoiceHistoryFormData.ToDocNo,
          ReportName: "103-AcRptPurchaseSalesVoucherSlip",
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
      this.ErrorPopup("record Not Found")
    }
  };


  onLoad() {
    this.dataSource = [];
    this.ActivateLoadPanel("Loading Data..");
    this.service
      .SaleInvoicehistory({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        FromDate: this.SaleInvoiceHistoryFormData.FromDate,
        ToDate: this.SaleInvoiceHistoryFormData.ToDate,
        FromDocNo: this.SaleInvoiceHistoryFormData.FromDocNo,
        ToDocNo: this.SaleInvoiceHistoryFormData.ToDocNo,
        SupplierCustomerId: this.SaleInvoiceHistoryFormData.SupplierCustomerId,
        ItemId: this.SaleInvoiceHistoryFormData.ItemId,
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

  onSubmit() {
    const result: any = this.SaleInvoiceHistoryForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.popoverVisible = false;
      this.dataSource = [];
      this.ActivateLoadPanel("Loading Data..")
      this.service
        .SaleInvoicehistory({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          FromDate: this.SaleInvoiceHistoryFormData.FromDate,
          ToDate: this.SaleInvoiceHistoryFormData.ToDate,
          FromDocNo: this.SaleInvoiceHistoryFormData.FromDocNo,
          ToDocNo: this.SaleInvoiceHistoryFormData.ToDocNo,
          SupplierCustomerId: this.SaleInvoiceHistoryFormData.SupplierCustomerId,
          ItemId: this.SaleInvoiceHistoryFormData.ItemId,
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
    this.SaleInvoiceHistoryFormData = new SaleInvoiceHistoryModel();
    this.SaleInvoiceHistoryFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.SaleInvoiceHistoryFormData.ToDate = new Date();
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
          hint: "226-SaleInvoiceRegister",
          onClick: this.ReportRegister206.bind(this),
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
      () => this.onLoad(),
      () => this.RefreshHistoryGridGrid(this.onLoad.bind(this), this.HistoryGridSateKey("SaleInvoiceHistoryGrid"), this.SaleInvoiceHistoryGrid)
    );
  }
}
