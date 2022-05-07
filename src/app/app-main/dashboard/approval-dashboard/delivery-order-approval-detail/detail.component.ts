import { Component, Input, OnInit } from "@angular/core";

import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { DeliveryOrderDHistoryDetailArray } from "../approval-dashboard.model";
import { ApprovalDashboardService } from "../approval-dashboard.service";
@Component({
  selector: "Approval-Dashboard-Detail",
  templateUrl: "./detail.component.html",
})
export class DeliverOrderApprovalDetailComponent implements OnInit {
  @Input() key: any;
  @Input() rowData: any;
  @Input() detaildataSource: any;
  @Input() type: string;
  SaleInvoiceDocumentTypeIds: string;
  gridDataSource = new Array<DeliveryOrderDHistoryDetailArray>();
  newList: any;
  SupplierCustomerId: number;
  SupplierCustomerList = [];
  parameter: string;
  detailVisible: boolean;
  deliveryOrderHistoryDetailArray: any;
  DeliveryOrderDetailVisibility: boolean = false;
  SupplyOrderDetailList = [];
  SupplyOrderDetailGridVisibility: boolean = false;
  constructor(private commonService: CommonBaseService, private service: ApprovalDashboardService) {}

  ngOnInit(): void {
    if (this.type == "DeliveryOrderDetail") {
      this.DeliveryOrderDetailVisibility = !this.DeliveryOrderDetailVisibility;
      this.GenerateDetailDataFromDataSource();
    } else if (this.type == "SupplyOrderDetail") {
      this.SupplyOrderDetailGridVisibility = !this.SupplyOrderDetailGridVisibility;
      this.GenerateDetailDataForSupplyOrder(this.rowData.Id);
    }
  }

  GenerateDetailDataFromDataSource() {
    for (let i = 0; i < this.detaildataSource.length; i++) {
      if (this.rowData.DocNo == this.detaildataSource[i].DocNo) {
        this.gridDataSource.push({
          OrderNo: this.detaildataSource[i].OrderNo,
          SupplierCustomer: this.detaildataSource[i].SupplierCustomer,
          ItemName: this.detaildataSource[i].ItemName,
          DoQty: this.detaildataSource[i].DoQty,
          DoWeight: this.detaildataSource[i].DoWeight,
          LoadingQty: this.detaildataSource[i].LoadingQty,
          LoadingWeight: this.detaildataSource[i].LoadingWeight,
          PackUOM: this.detaildataSource[i].PackUOM,
          PackTypeDesc: this.detaildataSource[i].PackTypeDesc,
        });
      }
    }
    console.log(this.gridDataSource);
  }

  GenerateDetailDataForSupplyOrder(Id) {
    this.service.getSupplyOrderById(Id).subscribe(
      (result) => {
        this.SupplyOrderDetailList = result.InvSupplyOrderDetailList;
        console.log(result);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
