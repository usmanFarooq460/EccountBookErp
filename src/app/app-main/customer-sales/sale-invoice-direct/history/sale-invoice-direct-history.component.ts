import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { PurchaseInvoiceDirectService } from "../sale-invoice-direct.service";

@Component({
  selector: "app-sale-invoice-direct-history",
  templateUrl: "./sale-invoice-direct-history.component.html",
  styles: [],
})
export class SaleInvoiceDirectHistoryComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  dataSource = [];
  VoucherHeadId = [];
  canUpdate: boolean;

  constructor(private router: Router, private service: PurchaseInvoiceDirectService, private commonService: CommonBaseService) {
    super();
  }

  ngOnInit(): void {
    this.getSaleBillList();
    this.userRights();
  }
  userRights() {
    this.commonService
      .userRights({
        UserId: this.commonService.UserId(),
        ScreenName: "InvfrmPurchasedirectInvoice",
        RightName: this.commonService.RoleName(),
      })
      .subscribe(
        (result) => {
          for (let { RightName, Value } of result) {
            if (RightName === "Update") {
              this.canUpdate = Value;
            }
          }
        },
        (error) => console.log(error)
      );
  }
  gotoForm() {
    this.router.navigate(["/cus-sales/sale-invoice-direct-form"]);
  }
  onEdit(e) {
    if (this.canUpdate) {
      this.router.navigate(["/cus-sales/sale-invoice-direct-form"], {
        queryParams: { Id: e.Id },
      });
    } else {
      notify("You don't have right to update", "error");
      return;
    }
  }

  getSaleBillList() {
    this.service
      .getSaleBillList({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 99,
        NoOfRecord: 5000,
        CanViewAllRecord: true,
      })
      .subscribe(
        (result) => {
          this.dataSource = result;
        },
        (error) => console.log(error)
      );
  }
  onPrint(e) {
    this.service
      .getpdfReport({
        DocumentTypeId: 56,
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
        ReportName: "220-InvRptPurchaseBillSupplierRiceSlip",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => console.log(error)
      );
  }
  PurchaseInvoiceVoucher103(e) {
    this.GetVoucherHeadIdForReport(e);
    this.service
      .getVoucherpdfReport({
        Id: this.VoucherHeadId,
        //Compulosry
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        DocumentTypeId: 56,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "103-AcRptPurchaseSalesVoucherSlip",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => console.log(error)
      );
  }
  PurchaseInvoiceVoucher104(e) {
    this.GetVoucherHeadIdForReport(e);
    this.service
      .getVoucherpdfReport({
        Id: this.VoucherHeadId,
        //Compulosry
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        DocumentTypeId: 56,
        // CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        // CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "104-AcRptGeneralJournalAcAndInventoryDetailSlip",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => console.log(error)
      );
  }
  GetVoucherHeadIdForReport = (e) => {
    this.service
      .getvoucherheadId({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 56,
        DocumentTypeSrNo: e.Id,
      })
      .subscribe(
        (result) => {
          this.VoucherHeadId = null;
          this.VoucherHeadId = result;
        },
        (error) => console.log(error)
      );
  };
  onToolbarPreparing(event) {
    this.toolbarPreparing(
      event,
      () => this.dataGrid.instance.refresh(),
      () => this.exportGrid(this.dataGrid.instance)
    );
  }
}
function notify(arg0: string, arg1: string) {
  throw new Error("Function not implemented.");
}
