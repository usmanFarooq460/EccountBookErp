import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { DetailArrayModelForReportAgainstOutstandingPurchaseOrder } from "../purchase-order-register.model";

@Component({
  selector: "purchase-order-register-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class PurchaseOrderRegisterDetail implements OnInit {
  @Input() rowData: any;
  @Input() data: any;
  @Input() type: string;
  DetailForReportAgainstOutstandingPurchaseOrders: boolean = false;
  detailDataList = new Array<DetailArrayModelForReportAgainstOutstandingPurchaseOrder>();

  constructor(private commonService: CommonBaseService) {}

  ngOnInit(): void {
    if (this.type == "DFRAOPO") {
      this.DetailForReportAgainstOutstandingPurchaseOrders = true;
      this.GenerateDetailDataForReportAgainstOutstandingPurchaseOrders(this.data);
    }
  }

  GenerateDetailDataForReportAgainstOutstandingPurchaseOrders(data) {
    this.detailDataList = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].ItemName == this.rowData.ItemName) {
        this.detailDataList.push({
          Supplier: data[i].Supplier,
          OrderWeight: data[i].OrderWeight,
          Qty: data[i].Qty,
          ItemSupAmount: data[i].ItemSupAmount,
          AvgRate: data[i].AvgRate,
          MaxRatebyItemCropSupplier: data[i].MaxRatebyItemCropSupplier,
          MinRateByItemCropSupplier: data[i].MinRateByItemCrop,
        });
      }
    }
  }
}
