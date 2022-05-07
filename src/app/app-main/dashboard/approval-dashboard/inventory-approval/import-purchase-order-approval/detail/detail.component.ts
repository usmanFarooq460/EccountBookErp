import { BaseActions } from "src/app/shared/Base/BaseActions";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-import-purchase-order-approval-detail",
  templateUrl: "./detail.component.html",
  styleUrls: [],
})
export class ImportPurchaseOrderApprovalDetailComponent extends BaseActions implements OnInit {
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
