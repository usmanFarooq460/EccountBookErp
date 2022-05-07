import { Component, Input, OnInit } from "@angular/core";
import { BaseActions } from "src/app/shared/Base/BaseActions";

@Component({
  selector: "purchase-return-trading-approval-detial",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class PurchaseReturnTradingApprovalDetailComponent extends BaseActions implements OnInit {
  @Input() key: any;
  @Input() rowData: any;
  @Input() dataSource: any;
  detailArray: any;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.detailArray = this.dataSource.filter(({ Id }) => Id == this.rowData.Id);
  }

  ngOnDestroy(): void {
    this.detailArray = [];
  }
}
