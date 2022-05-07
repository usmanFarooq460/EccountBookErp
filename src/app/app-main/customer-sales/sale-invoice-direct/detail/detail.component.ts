import { Component, Input, OnInit } from "@angular/core";
import { PurchaseInvoiceDirectService } from "../sale-invoice-direct.service";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";

@Component({
  selector: "purchase-invoice-direct-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class SaleInvoiceDirectDetailComponent implements OnInit {
  @Input() key: any;
  @Input() rowData: any;
  SaleInvoiceDocumentTypeIds: string;
  dataSource: any;
  newList: any;
  SupplierCustomerId: number;
  SupplierCustomerList = [];
  parameter: string;
  detailVisible: boolean;
  constructor(private service: PurchaseInvoiceDirectService, private commonService: CommonBaseService) {}

  ngOnInit(): void {
    this.GetDetail();
  }

  GetDetail() {
    this.service.getSaleInvoiceById(this.rowData.Id).subscribe(
      (result) => {
        this.dataSource = result.invPurchaseInvoiceDetailList;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
