import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { LcOrderService } from "../purchase-order.service";
@Component({
  selector: "import-purchase-order-history",
  templateUrl: "./purchase-order-history.component.html",
  styleUrls: [],
})
export class PurchaseOrderHistoryComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  dataSource = [];
  headerArray = [];
  constructor(private router: Router, private service: LcOrderService, private commonService: CommonBaseService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = true;
  }

  async ngOnInit() {
    this.breadCrumb("Import", "Purchase Order History");
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("frmImpPurchaseOrder"));
    this.PurchaseOrderGetAll();
  }
  filtering() {
    this.filter = !this.filter;
  }
  onEdit(e) {
    if (this.UserRightsObject.canUpdate == true) {
      this.router.navigate(["/import-definition/purchase-order-form"], {
        queryParams: { Id: e.Id },
      });
    } else {
      this.WarningPopup("You don't have right to Update!");
      return;
    }
  }

  gotoForm() {
    this.router.navigate(["/cus-sales/purchase-order-form"]);
  }

  PurchaseOrderGetAll() {
    this.ActivateLoadPanel("Loading Data!");
    this.service
      .ImPuchaseOrderSlipAndRegister_805({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        DocumentTypeId: 236,
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          console.log(result);
          this.GenerateHeaderArray(result);
          this.dataSource = result;
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }

  GenerateHeaderArray(data) {
    for (let i = 0; i < data.length; i++) {
      if (i == 0) {
        this.headerArray.push(data[i]);
      } else if (i > 0) {
        let flag = false;
        for (let j = 0; j < this.headerArray.length; j++) {
          if (this.headerArray[j].Id == data[i].Id) {
            flag = true;
            break;
          }
        }
        if (flag == false) {
          this.headerArray.push(data[i]);
        }
      }
    }
  }

  PurchaseOrderSlipB_805(e) {
    this.ActivateLoadPanel("Loading Report");
    this.service
      .PurchaseOrderSlipB_805({
        Id: e.Id,
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        DocumentTypeId: 236,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "805-PurchaseOrderSlipB",
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

  onToolbarPreparing(event) {
    this.HistoryGridToolBarPreparing(
      event,
      () => this.filtering(),
      () => this.PurchaseOrderGetAll(),
      () => this.RefreshHistoryGridGrid(this.PurchaseOrderGetAll.bind(this), this.HistoryGridSateKey("ImportPurchaseOrderHistoryState"), this.dataGrid)
    );
    this.HistoryGridExpanAllRowButton(event, () => this.ExpanAllRows(this.dataGrid));
  }
}
