import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "purchase-order-trading-register-detial",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class PurchaseOrderTradingRegisterDetailComponent implements OnInit {
  @Input() key: any;
  @Input() rowData: any;
  @Input() dataSource: any;
  detailArray = [];

  constructor() {}

  ngOnInit(): void {
    this.detailArray = this.dataSource.filter(({ Id }) => Id == this.rowData.Id);
  }
}
