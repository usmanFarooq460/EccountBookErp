import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "purchase-invoice-loader-detail",
  templateUrl: "./purchase-invoice-loader-detail.component.html",
  styleUrls: ["./purchase-invoice-loader-detail.component.scss"],
})
export class PurchaseInvoiceLoaderDetailComponent implements OnInit {
  @Input() rowData: any;
  @Input() dataSource: any;
  loaderDetailDataSource = [];
  constructor() {}

  ngOnInit(): void {
    this.loaderDetailDataSource = this.dataSource.filter(({ Id }) => Id == this.rowData.Id);
    console.log("dataSource in detail", this.dataSource);
    console.log("loader   detail", this.loaderDetailDataSource);
  }
}
