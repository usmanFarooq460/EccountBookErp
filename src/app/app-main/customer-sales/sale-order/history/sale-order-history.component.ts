import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { PurchaseOrderService } from "../sale-order.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { PdfReportsCommonMethods } from "src/app/shared/base/pdf-reports-common-methods";
import { MostUsedMethods, HistoryShortcutKeysHolderObject } from "src/app/shared/Base/mostUsedMethods";
import { ShortcutKeysService } from "src/app/shared/Base/shortcut-Keys.service";
@Component({
  selector: "app-sale-order-history",
  templateUrl: "./sale-order-history.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class SaleOrderHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("dataGrid", { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("MAINPAGE")
  MAINPAGE;
  dataSource = [];
  MostUsedMethods: MostUsedMethods;
  constructor(
    private router: Router,
    private service: PurchaseOrderService,
    private pdfReportsCommonnMethods: PdfReportsCommonMethods,
    private commonMethods: CommonMethodsForCombos,
    private keyboardShourtcuts: ShortcutKeysService,
    private commonService: CommonBaseService
  ) {
    super();
    this.MostUsedMethods = new MostUsedMethods(commonMethods, keyboardShourtcuts);
    this.MostUsedMethods.HistoryGridShortcutKeys([
      { key: "control.a", ConsectiveNumberOfKeys: 1000, ActionToPerform: this.GoToForm.bind(this) },
      { key: "control.g", ConsectiveNumberOfKeys: 1000, ActionToPerform: this.FocusOnGrid.bind(this) },
      { key: "control.f", ConsectiveNumberOfKeys: 1000, ActionToPerform: this.filtering.bind(this) },
      { key: "control.l", ConsectiveNumberOfKeys: 1000, ActionToPerform: this.GetAllRecords.bind(this) },
      { key: "control.o", ConsectiveNumberOfKeys: 1000, ActionToPerform: this.FocusOutOfGrid.bind(this) },
    ]);
  }
  async ngOnInit() {
    this.breadCrumb("Customer Sales", "Sale Order");
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("SaleOrder"));
    this.GetSpecificNumberOfRecord();
  }
  //#region ShortCutKeys
  FocusOutOfGrid() {
    setTimeout(() => {
      this.MAINPAGE.focus();
    }, 100);
  }
  FocusOnGrid() {
    setTimeout(() => {
      this.dataGrid.instance.focus();
    }, 100);
    this.DataGridFocusedRowHandlerObject.FocusedRowIndex = 0;
  }
  onKeyDown = (e) => {
    if (e.event.key == "e") {
      this.onEdit({ Id: this.DataGridFocusedRowHandlerObject.FocusedRowData });
    } else if (e.event.key == "a") {
      this.GoToForm();
    } else if (e.event.key == "p") {
      this.onPrint({ Id: this.DataGridFocusedRowHandlerObject.FocusedRowData });
    } else if (e.event.key == "l") {
      this.GetAllRecords();
    }
  };
  handleRowDblClick = (e) => {
    this.onEdit(e.data.Id);
  };
  setFocusedRowData = (e) => {
    this.DataGridFocusedRowHandlerObject.FocusedRowData = e.row.key;
    console.log(this.DataGridFocusedRowHandlerObject.FocusedRowData);
  };
  //#endregion
  onEdit(e) {
    if (this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have Right to Update!");
      return;
    }
    this.router.navigate(["/cus-sales/sale-order-form"], {
      queryParams: { Id: e.Id },
    });
  }
  filtering() {
    this.filter = !this.filter;
  }
  checkClick(e) {
    this.warningPopupVisibility = false;
  }
  GoToForm() {
    this.router.navigate(["/cus-sales/sale-order-form"]);
  }
  GetSpecificNumberOfRecord() {
    this.SaleOrderHistory(21);
  }
  GetAllRecords() {
    this.SaleOrderHistory(null);
  }
  SaleOrderHistory(NoOfRecords) {
    this.service
      .getSaleOrderList({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        DocumentTypeId: 81,
        CanViewAllRecord: this.UserRightsObject.CanView_AllRecord,
        NoOfRecords: NoOfRecords,
      })
      .subscribe(
        (result) => {
          this.dataSource = result;
        },
        (error) => console.log(error)
      );
  }
  async onPrint(e) {
    this.ActivateLoadPanel("Loading Report!");
    this.OpenPdfReportInNewTab(await this.pdfReportsCommonnMethods.SaleOrderRiceSlip_273(e.Id).catch((error) => this.HandleError(error)));
    this.DeActivateLoadPanel();
  }
  SaleOrderHistoryGridToolbarPreparing(event) {
    this.HistoryGridToolBarPreparing(
      event,
      () => this.filtering(),
      () => this.GetAllRecords(),
      () => this.RefreshHistoryGridGrid(this.GetSpecificNumberOfRecord.bind(this), this.HistoryGridSateKey("SaleOrderRiceHistoryGrid"), this.dataGrid)
    );
  }
}
