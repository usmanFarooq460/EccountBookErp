import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { PurchaseInvoiceService } from "../purchase-invoice.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-purchase-bill-history",
  templateUrl: "./purchase-invoice-history.component.html",
  styles: [],
})
export class PurchaseInvoiceHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("purchaseInvoiceHistoryGrid", { static: false })
  purchaseInvoiceHistoryGrid: DxDataGridComponent;

  dataSource = [];
  VoucherHeadId = [];
  historyGridState: any;
  historyDetailVisible: string = "HistoryDetail";

  constructor(private router: Router, private service: PurchaseInvoiceService, private commonService: CommonBaseService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = true;
  }

  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("InvfrmPurchaseInvoice"));
    this.getSpecificNumberOfRecords();
  }

  gotoForm() {
    this.UserRightsObject.canSave ? this.router.navigate(["/cus-sales/purchase-invoice-form"]) : this.ErrorPopup("You dont have Rihgt to Save");
  }
  onEdit(e) {
    this.UserRightsObject.canUpdate
      ? this.router.navigate(["/cus-sales/purchase-invoice-form"], {
          queryParams: { Id: e.Id },
        })
      : this.ErrorPopup("You dont have Right to Update!");
  }

  GetAllRecords() {
    this.getPurchaseInvoiceList(null);
  }

  getSpecificNumberOfRecords() {
    this.getPurchaseInvoiceList(21);
  }

  getPurchaseInvoiceList(noOfRecords) {
    this.ActivateLoadPanel("Fetching Data");
    this.service
      .getPurchaseBillList({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 56,
        NoOfRecord: noOfRecords,
        CanViewAllRecord: this.UserRightsObject.CanView_AllRecord,
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
  onPrint(e) {
    this.ActivateLoadPanel("Generating Report!");
    this.service
      .getpdfReport({
        DocumentTypeId: 56,
        Id: e.Id,
        PihId: e.Id,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        FromDate: null,
        ToDate: null,
        FromDocNo: null,
        ToDocNo: null,
        SupplierCustomerId: null,
        BranchesId: null,
        ReportName: "220-InvRptPurchaseBillSupplierRiceSlip",
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
  PurchaseInvoiceVoucher103(e) {
    this.GetVoucherHeadIdForReport(e);
    this.ActivateLoadPanel("Generating Report!");
    this.service
      .getVoucherpdfReport({
        Id: this.VoucherHeadId,
        //Compulosry
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 56,
        ReportName: "103-AcRptPurchaseSalesVoucherSlip",
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          window.open(result);
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  PurchaseInvoiceVoucher104(e) {
    this.GetVoucherHeadIdForReport(e);
    this.ActivateLoadPanel("Fetching Report!");
    this.service
      .getVoucherpdfReport({
        Id: this.VoucherHeadId,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 56,
        ReportName: "104-AcRptGeneralJournalAcAndInventoryDetailSlip",
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
  GetVoucherHeadIdForReport = (e) => {
    this.ActivateLoadPanel("Generating Report !");
    this.service
      .getvoucherheadId({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 56,
        DocumentTypeSrNo: e.Id,
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.VoucherHeadId = null;
          this.VoucherHeadId = result;
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  };

  onToolbarPreparing(event) {
    this.HistoryGridToolBarPreparing(
      event,
      () => this.filtering(),
      () => this.GetAllRecords(),
      () => this.RefreshHistoryGridGrid(this.getSpecificNumberOfRecords.bind(this), this.HistoryGridSateKey("purchaseInvoiceHistoryGrid"), this.purchaseInvoiceHistoryGrid)
    );
    // this.HistoryGridExpanAllRowButton(event, () => this.ExpanAllRows(this.dataGrid));
  }
}
