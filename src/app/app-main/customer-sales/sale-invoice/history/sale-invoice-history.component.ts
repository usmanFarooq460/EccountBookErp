import { ThrowStmt } from "@angular/compiler";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { SaleInvoiceService } from "../sale-invoice.service";

@Component({
  selector: "app-sale-invoice-history",
  templateUrl: "./sale-invoice-history.component.html",
  styles: [],
})
export class SaleInvoiceHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("saleInvoiceHistoryGrid", { static: false })
  saleInvoiceHistoryGrid: DxDataGridComponent;

  dataSource = [];
  VoucherHeadId = [];
  canUpdate: boolean;

  constructor(private router: Router, private service: SaleInvoiceService, private commonService: CommonBaseService, private commonMethods: CommonMethodsForCombos) {
    super();
  }

  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("InvfrmPurchaseInvoice"));
    this.getPurchaseBillList();
  }

  gotoForm() {
    this.UserRightsObject.canSave ? this.router.navigate(["/cus-sales/sale-invoice-form"]) : this.ErrorPopup("You dont have Right to Save");
  }
  onEdit(e) {
    this.UserRightsObject.canUpdate
      ? this.router.navigate(["/cus-sales/sale-invoice-form"], {
          queryParams: { Id: e.Id },
        })
      : this.ErrorPopup("You dont have Right to Update");
  }

  getPurchaseBillList() {
    this.ActivateLoadPanel("Fetching Data!");
    this.service
      .getSaleInvoiceList({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 95,
        NoOfRecord: 10000,
        CanViewAllRecord: true,
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
  Voucher301(e) {
    this.ActivateLoadPanel("Generating Report");
    this.service
      .getpdfReport({
        DocumentTypeId: 95,
        Id: e.Id,
        PihId: e.Id,
        //Compulosry
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        FromDate: null,
        ToDate: null,
        FromDocNo: null,
        ToDocNo: null,
        SupplierCustomerId: null,
        BranchesId: null,
        ReportName: "301-InvRepSaleBillCustomer",
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
  //#region  Report Slip Number 103

  PurchaseInvoiceVoucher103(e) {
    this.ActivateLoadPanel("Generating Report!");
    this.GetVoucherHeadIdForReport(e);
    this.service
      .getVoucherpdfReport({
        Id: this.VoucherHeadId,
        //Compulosry
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        DocumentTypeId: 95,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "103-AcRptPurchaseSalesVoucherSlip",
        ApprovedFilter: "All",
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

  Voucher304(e) {
    this.ActivateLoadPanel("Generating Report! ");
    this.GetVoucherHeadIdForReport(e);
    this.service
      .getVoucherpdfReport({
        Id: this.VoucherHeadId,
        //Compulosry
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 95,
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
    this.ActivateLoadPanel("Generating Report! ");
    this.service
      .getvoucherheadId({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 95,
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
  DummyMethod() {}
  onToolbarPreparing = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("saleInvoiceHistoryGrid"), this.saleInvoiceHistoryGrid));
    this.FilterButtonInGridToolbar(e);
  };
}
