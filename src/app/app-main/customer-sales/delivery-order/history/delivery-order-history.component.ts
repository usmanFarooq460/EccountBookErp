import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { DeliveryOrderService } from "../delivery-order.service";
import { DeliveryOrderHeaderArray } from "../delivery-order.model";

@Component({
  selector: "app-delivery-order-history",
  templateUrl: "./delivery-order-history.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class DeliveryOrderHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("dataGrid", { static: false })
  dataGrid: DxDataGridComponent;

  dataSource = [];
  gridPageSize: any;
  deliveryOrderHistoryHeaderArray = new Array<DeliveryOrderHeaderArray>();

  constructor(private router: Router, private service: DeliveryOrderService, private commonService: CommonBaseService) {
    super();
    this.filter = false;
  }
  filtering() {
    this.filter = !this.filter;
  }
  ngOnInit(): void {
    this.breadCrumb("Customer Sales", "Delivery Order");

    this.LoadGivenNumbersOfRecords();
  }

  onEdit(e) {
    if (e.DeliveryOrderType == "Export") {
      this.WarningPopup("You cannot Update Delivery Order Of Type Export. Please contact your authority Person!");
    } else {
      this.router.navigate(["/cus-sales/delivery-order-form"], {
        queryParams: { Id: e.Id },
      });
    }
  }

  gotoSaleOrderForm() {
    this.router.navigate(["/cus-sales/delivery-order-form"]);
  }
  LoadGivenNumbersOfRecords() {
    this.GetDeliveryOrderHistoy(21);
  }
  LoadAllRecords() {
    this.GetDeliveryOrderHistoy(null);
  }

  GetDeliveryOrderHistoy(records) {
    this.service
      .GetAll({
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
        NoOfRecords: records,
        DocumentTypeId: 84,
        EntryUser: this.commonService.UserId(),
      })
      .subscribe(
        (result) => {
          this.dataSource = result;
          this.gridPageSize = [20, 100, result.length];
          this.generateHeaderAndDetailArray();
        },
        (error) => console.log(error)
      );
  }

  generateHeaderAndDetailArray() {
    if (this.dataSource.length > 0) {
      for (let i = 0; i < this.dataSource.length; i++) {
        let TotalQuantityInOneDelieveryOrder: number = 0;
        let TotalWeightInOneDelieveryOrder: number = 0;
        let TotalSaleOrdersInOneDelieveryOrder: number = 0;
        let flag = false;
        for (let j = 0; j < this.dataSource.length; j++) {
          if (this.dataSource[i].DocNo == this.dataSource[j].DocNo) {
            TotalQuantityInOneDelieveryOrder += this.dataSource[j].DoQty;
            TotalWeightInOneDelieveryOrder += this.dataSource[j].DoWeight;
            TotalSaleOrdersInOneDelieveryOrder += 1;
          }
        }
        if (i == 0) {
          this.deliveryOrderHistoryHeaderArray.push({
            Id: this.dataSource[i].Id,
            DocDate: this.dataSource[i].DocDate,
            DocNo: this.dataSource[i].DocNo,
            DeliveryOrderType: this.dataSource[i].DeliveryOrderType,
            DoQty: TotalQuantityInOneDelieveryOrder,
            DoWeight: TotalWeightInOneDelieveryOrder,
            TSaleOrders: TotalSaleOrdersInOneDelieveryOrder,
            Remarks: this.dataSource[i].LoadingRemarks,
          });
        } else if (i > 0) {
          for (let z = 0; z < this.deliveryOrderHistoryHeaderArray.length; z++) {
            if (this.dataSource[i].DocNo == this.deliveryOrderHistoryHeaderArray[z].DocNo) {
              flag = true;
            }
          }
          if (flag == true) {
            continue;
          } else {
            this.deliveryOrderHistoryHeaderArray.push({
              Id: this.dataSource[i].Id,
              DocDate: this.dataSource[i].DocDate,
              DocNo: this.dataSource[i].DocNo,
              DeliveryOrderType: this.dataSource[i].DeliveryOrderType,
              DoQty: TotalQuantityInOneDelieveryOrder,
              DoWeight: TotalWeightInOneDelieveryOrder,
              TSaleOrders: TotalSaleOrdersInOneDelieveryOrder,
              Remarks: this.dataSource[i].LoadingRemarks,
            });
          }
        }
      }
    }
  }
  InvoiceSlip262(e) {
    this.service
      .PDFReportSlip262({
        Id: e.Id,
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        DocumentTypeId: 84,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "262-DeliveryOrderSlip",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => console.log(error)
      );
  }
  onToolbarPreparing(event) {
    this.HistoryGridToolBarPreparing(
      event,
      () => this.filtering(),
      () => this.LoadAllRecords(),
      () => this.RefreshHistoryGridGrid(this.LoadGivenNumbersOfRecords.bind(this), this.HistoryGridSateKey("DeliveryOrderHistoryGrid"), this.dataGrid)
    );
    this.HistoryGridExpanAllRowButton(event, () => this.ExpanAllRows(this.dataGrid));
  }
}
