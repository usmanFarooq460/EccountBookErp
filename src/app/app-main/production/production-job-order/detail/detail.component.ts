import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { ProductionJobOrderService } from "../production-job-order.service";

@Component({
  selector: "production-job-order-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class ProductionJobOrderDetailComponent implements OnInit {
  @Input() key: any;
  @Input() rowData: any;
  inputDataSource = [];
  outputDataSource = [];
  overheadDataSource = [];
  packingMaterialDataSource = [];
  accountHeadList = [];
  itemList = [];
  chargeToList = [
    { Id: 2, Label: "Recovery By Product" },
    { Id: 3, Label: "Recovery Head Rice" },
  ];
  loadPanelForDetailVisible: boolean;
  constructor(private commonService: CommonBaseService, private service: ProductionJobOrderService) {}

  ngOnInit(): void {
    this.loadPanelForDetailVisible = true;
    this.GenerateDetailData();
  }

  GenerateDetailData() {
    this.service.GetByID(this.rowData.Id).subscribe(
      (result: any) => {
        this.inputDataSource = result.invProductionJobOrderInput;

        this.outputDataSource = result.invProductionJobOrderOutput;
        this.loadPanelForDetailVisible = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
