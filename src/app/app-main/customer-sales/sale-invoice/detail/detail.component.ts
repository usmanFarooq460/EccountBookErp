import { Component, Input, OnInit } from "@angular/core";
import { SaleInvoiceService } from "../sale-invoice.service";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import notify from "devextreme/ui/notify";
import { isString } from "@ng-bootstrap/ng-bootstrap/util/util";
@Component({
  selector: "detail-view",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class SaleInvoiceDetailComponent implements OnInit {
  @Input() key: any;
  @Input() rowData: any;
  SaleInvoiceDocumentTypeIds: string;
  dataSource: any;
  newList: any;
  SupplierCustomerId: number;
  SupplierCustomerList = [];
  parameter: string;
  detailVisible: boolean;
  constructor(private service: SaleInvoiceService, private commonService: CommonBaseService) {}

  ngOnInit(): void {
    this.GetDetail();
  }

  GetDetail() {
    this.service.getSaleInvoiceById(this.rowData.Id).subscribe(
      (result) => {
        this.dataSource = result.InvSaleInvoiceDetaillist;
        console.log(result);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
