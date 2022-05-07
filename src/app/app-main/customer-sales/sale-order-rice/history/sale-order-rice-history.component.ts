import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent } from "devextreme-angular";
import notify from "devextreme/ui/notify";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { PurchaseOrderService } from "../sale-order-rice.service";

@Component({
  selector: "app-sale-order-rice-history",
  templateUrl: "./sale-order-rice-history.component.html",
  styleUrls: [],
})
export class SaleOrderRiceHistoryComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  dataSource = [];
  canUpdate: boolean;
  canViewAllRecordUpdate: boolean;
  constructor(private router: Router, private service: PurchaseOrderService, private commonService: CommonBaseService) {
    super();
    this.filter = false;
  }

  ngOnInit(): void {
    this.breadCrumb("Customer Sales", "Sale Order");
    this.userRights();
    this.getPurchaseOrderList();
  }

  filtering() {
    this.filter = !this.filter;
  }

  onEdit(e) {
    if (this.canUpdate) {
      this.router.navigate(["/cus-sales/sale-order-form"], {
        queryParams: { Id: e.Id },
      });
    } else {
      notify("You don't have right to update", "error");
      return;
    }
  }
  userRights() {
    this.commonService
      .userRights({
        UserId: this.commonService.UserId(),
        ScreenName: "SaleOrder",
        RightName: this.commonService.RoleName(),
      })
      .subscribe(
        (result) => {
          for (let { RightName, Value } of result) {
            if (RightName === "Update") {
              this.canUpdate = Value;
            }
            if (RightName === "CanView AllRecord") {
              this.canViewAllRecordUpdate = Value;
            }
          }
        },
        (error) => console.log(error)
      );
  }
  gotoPurchaseOrderForm() {
    this.router.navigate(["/cus-sales/sale-order-form"]);
  }

  getPurchaseOrderList() {
    this.service
      .getPurchaseOrderList({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        DocumentTypeId: 81,
        CanViewAllRecord: this.canViewAllRecordUpdate,
      })
      .subscribe(
        (result) => (this.dataSource = result),
        (error) => console.log(error)
      );
  }
  onPrint(e) {
    this.service
      .getPurchaseOrderPdfReport({
        DocumentTypeId: 81,
        Id: e.Id,
        ApprovedFilter: "All",
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "273-InvRptSaleOrderSlip",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => console.log(error)
      );
  }
  onToolbarPreparing(event) {
    this.toolbarPreparing(
      event,
      () => this.dataGrid.instance.refresh(),
      () => this.exportGrid(this.dataGrid.instance)
    );
  }
}
