import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "job-management-detial",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class JobManagementRptDetailComponent implements OnInit {
  @Input() rowData: any;
  @Input() dataSource: any;
  detailArray = [];
  IsWrapped: boolean = false;
  wrapButtonIcon = "aligncenter";
  unWrapButtonIcon = "alignjustify";

  constructor() {}

  ngOnInit(): void {
    this.detailArray = this.dataSource.filter(({ HeaderAccountTitle, VoucherCode }) => HeaderAccountTitle == this.rowData.HeaderAccountTitle && VoucherCode == this.rowData.VoucherCode);
  }
  handleToobarPreparing(event) {
    event.toolbarOptions.items.unshift({
      location: "after",
      widget: "dxButton",
      options: {
        id: "gridWrapButton",
        icon: this.IsWrapped ? this.unWrapButtonIcon : this.wrapButtonIcon,
        hint: "Expand All Rows",
        onClick: () => {
          this.IsWrapped = !this.IsWrapped;
        },
      },
    });
  }
}
