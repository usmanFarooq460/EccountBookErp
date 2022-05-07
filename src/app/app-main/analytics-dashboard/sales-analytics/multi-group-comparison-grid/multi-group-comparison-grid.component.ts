import { Component, OnInit, Input, Output, EventEmitter, HostListener } from "@angular/core";
import notify from "devextreme/ui/notify";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { SalesAnalyticsService } from "../sales-analytics.service";

@Component({
  selector: "multi-group-comparison-grid-for-sale",
  templateUrl: "./multi-group-comparison-grid.component.html",
  styleUrls: ["./multi-group-comparison-grid.component.scss", "/src/assets/scss/custom/components/_gridHeading.scss"],
})
export class MultiGroupComparisonGridComponentForSale extends BaseActions implements OnInit {
  PopupHeight: number = window.innerHeight - (window.innerHeight * 10) / 100;
  PopupWidth: number = window.innerWidth - (window.innerHeight * 10) / 100;

  PopupGridHeight: number = this.PopupHeight - (this.PopupHeight * 20) / 100;
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    event.target.innerWidth;
    let height = event.target.innerHeight;
    let width = event.target.innerWidth;
    this.PopupHeight = height - (height * 10) / 100;
    this.PopupWidth = width - (width * 10) / 100;
    this.PopupGridHeight = this.PopupHeight - (this.PopupHeight * 20) / 100;
  }

  //=============================================================================
  @Input() multiGroupComparisonReportPopupVisible: boolean;
  @Input() ComparisonName: string;
  @Input() FirstGroupCaption: string;
  @Input() MultiGroupCaption: string;
  @Output() closePopup = new EventEmitter();
  @Input() dataSource: any;
  @Input() headerArray: any;
  @Input() totalQty: number;
  @Input() totalWeight: number;
  @Input() totalAmount: number;
  // @Input() multiGroupComparisonReportPopup2Visible: boolean;
  // @Input() dataSource2: any;

  filter: boolean = true;

  constructor(private service: SalesAnalyticsService) {
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
        locatsion: "before",
        template: "SalesAnalyticsMultipleGropGridTemplate",
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
