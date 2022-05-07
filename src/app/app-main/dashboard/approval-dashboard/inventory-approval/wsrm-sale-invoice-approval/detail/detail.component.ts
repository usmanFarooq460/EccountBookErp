import { BaseActions } from "src/app/shared/Base/BaseActions";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-wsrm-sale-invoice-approval-detail",
  templateUrl: "./detail.component.html",
  styleUrls: [],
})
export class WsrmSaleInvoiceApprovalDetialComponent extends BaseActions implements OnInit {
  @Input() rowData: any;
  @Input() dataSource: any;
  detailDataSource = [];

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.detailDataSource = this.dataSource.filter(({ Id }) => Id == this.rowData.Id);
  }
}
