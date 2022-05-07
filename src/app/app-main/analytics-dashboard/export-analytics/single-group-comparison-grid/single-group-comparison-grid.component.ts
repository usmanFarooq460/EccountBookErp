import { Component, OnInit, Input, Output, EventEmitter, HostListener } from "@angular/core";
import notify from "devextreme/ui/notify";
import { ExportAnalyticsService } from "../export-analytics.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
@Component({
  selector: "single-group-comparison-grid",
  templateUrl: "./single-group-comparison-grid.component.html",
  styleUrls: ["./single-group-comparison-grid.component.scss", "/src/assets/scss/custom/components/_gridHeading.scss"],
})
export class SingleGroupComparisonGridComponent extends BaseActions implements OnInit {
  //=============================================================================
  @Input() singleGroupComparisonReportPopupVisible: boolean;
  @Input() ComparisonName: string;
  @Input() FirstGroupCaption: string;
  @Output() closePopup = new EventEmitter();

  @Input() dataSource: any;
  @Input() totalExport: number;

  filter: boolean = true;

  constructor(private service: ExportAnalyticsService) {
    super();
  }

  ngOnInit(): void {}

  filtering() {
    this.filter = !this.filter;
  }
  ClosePopup() {
    this.closePopup.emit("1");
  }
  openChartPopup() {
    notify("Coming Soon....!", "success");
  }
  singleGroupComparisonGridToolbarPreparing(event) {
    event.toolbarOptions.items.unshift(
      {
        locatjion: "before",
        template: "ExportAnalyticsSingleGroupGridTemplate",
      },
      {
        location: "after",

        widget: "dxButton",
        options: {
          id: "outstandingPaddyPurchaseOrderChartButton",
          icon: "chart",
          hint: "Chart",
          onClick: this.openChartPopup.bind(this),
        },
      },
      {
        location: "after",

        widget: "dxButton",
        options: {
          id: "historyGridFilterButton",
          icon: "filter",
          hint: "Filter",
          onClick: this.filtering.bind(this),
        },
      }
    );
  }
}
