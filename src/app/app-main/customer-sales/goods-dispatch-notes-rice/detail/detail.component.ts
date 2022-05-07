import { Component, Input, OnInit } from "@angular/core";
import { GoodsDispatchNoteService } from "../goods-dispatch-notes-rice.service";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { DataSourceDTO } from "../goods-dispatch-notes-rice.model";

@Component({
  selector: "detail-view-gdn",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class GdnDetailComponent implements OnInit {
  @Input() key: any;
  @Input() rowData: any;
  @Input() detaildataSource: any;
  SaleInvoiceDocumentTypeIds: string;

  gridDataSource = new Array<DataSourceDTO>();
  newList: any;
  SupplierCustomerId: number;
  SupplierCustomerList = [];
  parameter: string;
  detailVisible: boolean;
  GdnHistoryDetailArray: any;
  constructor(private service: GoodsDispatchNoteService, private commonService: CommonBaseService) {}

  ngOnInit(): void {
    this.GenerateDetailDataFromDataSource();
  }

  GenerateDetailDataFromDataSource() {
    this.service.getGrnById(this.rowData.Id).subscribe(
      (result: any) => {
        this.gridDataSource = result.invGdnDetail;
      },
      (error) => console.log(error)
    );
  }
}
