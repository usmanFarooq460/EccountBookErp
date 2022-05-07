import { Component, OnInit, Input, Output, EventEmitter, HostListener } from "@angular/core";
import notify from "devextreme/ui/notify";
import { ExportAnalyticsService } from "../export-analytics.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
@Component({
  selector: "multi-group-comparison-grid",
  templateUrl: "./multi-group-comparison-grid.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_gridHeading.scss", "./multi-group-comparison-grid.component.scss"],
})
export class MultiGroupComparisonGridComponent extends BaseActions implements OnInit {
  PopupHeight: number = window.innerHeight - (window.innerHeight * 10) / 100;
  PopupWidth: number = window.innerWidth - (window.innerHeight * 10) / 100;

  //=============================================================================
  @Input() multiGroupComparisonReportPopupVisible: boolean;
  @Input() ComparisonName: string;
  @Input() FirstGroupCaption: string;
  @Input() MultiGroupCaption: string;
  @Output() closePopup = new EventEmitter();

  @Input() dataSource: any;
  @Input() headerArray: any;
  @Input() totalExport: number;
  // @Input() multiGroupComparisonReportPopup2Visible: boolean;
  // @Input() dataSource2: any;

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
  onRowPrepared(e) {
    if (e.rowType == "data") {
      e.rowElement.className = e.rowElement.className.replace("dx-row-alt", "");
      e.rowElement.style.backgroundColor = "#36e8eb";
      e.rowElement.style.fontWeight = "bold";
      e.rowElement.style.fontSize = "16px";
    }
  }
  singleGroupComparisonGridToolbarPreparing(event) {
    event.toolbarOptions.items.unshift(
      {
        localtion: "before",
        template: "ExportAnalyticsMultipleGropGridTemplate",
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
