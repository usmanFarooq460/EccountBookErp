import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

@Component({
  selector: "app-data-grid",
  templateUrl: "./data-grid.component.html",
  styles: [],
})
export class DataGridComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  @Input() dataSource;
  @Input() columns;
  @Input() summary;
  @Input() filter: boolean;
  @Input() columnChooser: boolean;
  @Input() excelExport: boolean;
  @Input() toolbarOptions: boolean;
  @Input() grouping: boolean;
  @Input() excelFileName: string;
  @Input() selectionMode: string;
  @Input() actionsEnabled: boolean;
  @Input() editEnabled: boolean;
  @Input() deleteEnabled: boolean;
  @Output() editEntity = new EventEmitter<any>();
  @Output() getSummary = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    this.test();
  }

  editRow(entity, index) {
    this.editEntity.emit({ entity, index });
  }

  deleteRow(index) {
    this.dataSource.splice(index, 1);
  }

  test() {
    this.getSummary.emit(this.dataGrid.instance.getTotalSummaryValue("Weight"));
  }

  exportGrid() {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.dataGrid.instance,
    }).then(() => {
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        const header = "EccountBook";
        const footer = `Page ${i} of ${pageCount}`;
        doc.text(i <= 1 ? header : "", 5, 5, { baseline: "top" });
        // doc.text(
        //   footer,
        //   pageWidth / 2 - doc.getTextWidth(footer) / 2,
        //   pageHeight - 15,
        //   { baseline: "bottom" }
        // );
      }
      // doc.save("test.pdf");
      doc.output("dataurlnewwindow");
    });
  }

  refreshDataGrid() {
    this.dataGrid.instance.refresh();
  }

  onToolbarPreparing(event) {
    this.toolbarOptions === true &&
      event.toolbarOptions.items.unshift(
        {
          location: "after",
          widget: "dxButton",
          options: {
            icon: "refresh",
            hint: "Refresh",
            onClick: this.refreshDataGrid.bind(this),
          },
        },
        {
          location: "after",
          widget: "dxButton",
          options: {
            icon: "paste",
            hint: "Export Pdf",
            onClick: this.exportGrid.bind(this),
          },
        }
      );
  }
}
