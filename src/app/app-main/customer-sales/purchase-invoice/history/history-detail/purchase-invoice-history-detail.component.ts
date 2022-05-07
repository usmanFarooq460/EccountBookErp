import { Component, Input, OnInit } from "@angular/core";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { PurchaseInvoiceService } from "../../purchase-invoice.service";

@Component({
  selector: "app-purchase-invoice-history-detail",
  templateUrl: "./purchase-invoice-history-detail.component.html",
  styleUrls: [],
})
export class PurchaseInvoiceHistoryDetailComponent extends BaseActions implements OnInit {
  // @Input() key: any;
  @Input() rowData: any;
  // @Input() detailVisibilityType: string;
  // @Input() : any;
  historyDetailDataSource = [];
  constructor(private service: PurchaseInvoiceService) {
    super();
  }

  ngOnInit(): void {
    this.GetDetail();
  }

  GetDetail() {
    this.service.getPurchaseBillById(this.rowData.Id).subscribe(
      (resp) => {
        this.historyDetailDataSource = resp.invPurchaseInvoiceDetailList;
      },
      (error) => {
        this.HandleError(error);
      }
    );
  }
}
