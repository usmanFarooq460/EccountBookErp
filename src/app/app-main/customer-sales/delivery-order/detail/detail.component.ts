import { Component, Input, OnInit } from "@angular/core";
import { DeliveryOrderService } from "../delivery-order.service";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { DeliveryOrderDHistoryDetailArray } from "../delivery-order.model";
import notify from "devextreme/ui/notify";
import { isString } from "@ng-bootstrap/ng-bootstrap/util/util";
@Component({
  selector: "detail-view-DO",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class DeliveryOrderDetailComponent implements OnInit {
  @Input() key: any;
  @Input() rowData: any;
  @Input() detaildataSource: any;
  SaleInvoiceDocumentTypeIds: string;
  gridDataSource = new Array<DeliveryOrderDHistoryDetailArray>();
  newList: any;
  SupplierCustomerId: number;
  SupplierCustomerList = [];
  parameter: string;
  detailVisible: boolean;
  deliveryOrderHistoryDetailArray: any;
  constructor(private service: DeliveryOrderService, private commonService: CommonBaseService) {}

  ngOnInit(): void {
    this.GenerateDetailDataFromDataSource();
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
          WareHouseName: this.detaildataSource[i].WareHouseName,
        });
      }
    }
  }
}
