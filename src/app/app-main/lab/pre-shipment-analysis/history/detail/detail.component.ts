import { Component, Input, OnInit } from "@angular/core";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { PreShipmentAnalysisService } from "../../pre-shipment-analysis.service"

@Component({
  selector: "pre-shipment-analysis-history-detial",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class PreShipmentAnalysisDetailDetailComponent extends BaseActions implements OnInit {
  @Input() key: any;
  @Input() rowData: any;
  detailArray: any;

  constructor(private service: PreShipmentAnalysisService) {
    super();
  }

  ngOnInit(): void {
    // this.detailArray = this.dataSource.filter(({ Id }) => Id == this.rowData.Id);
    this.GetById();
  }

  ngOnDestroy(): void {
    this.detailArray = [];
  }
  GetById()
  {
    this.service.GetById(this.rowData.Id).subscribe(
      (result)=> {
        this.detailArray=result.LotInspectionDetails;
      },
      (error)=>
      {
        this.HandleError(error);
      }
    )
  }
}
