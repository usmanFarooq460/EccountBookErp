import { Component, Input, OnInit } from "@angular/core";
@Component({
  selector: "multi-group-comparison-detail-for-sales",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class MultiGroupComparisonDetailForSale implements OnInit {
  @Input() key: any;
  @Input() rowData: any;
  @Input() dataSource: any;
  @Input() secondGroupCaption: string;
  detailDataSource = [];
  constructor() {}

  ngOnInit(): void {
    this.detailDataSource = this.dataSource.filter(({ FirstGroupName }) => FirstGroupName == this.rowData.FirstGroupName);
  }
}
