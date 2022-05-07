import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

@Component({
  selector: "app-report-data-grid",
  templateUrl: "./report-data-grid.component.html",
  styles: [],
})
export class ReportDataGridComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  @Input() dataSource;
  @Input() columns;
  @Input() summary;
  @Input() filter: boolean;
  @Input() excelFileName: string;
  @Input() pdfReportName: string;

  constructor() {}

  ngOnInit(): void {}

  exportGrid(dataGrid, reportName?) {
    const doc = new jsPDF();
    const report_Name = reportName;
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: dataGrid,
      autoTableOptions: {
        theme: "striped",
        headStyles: { textColor: "#fff", fontSize: 10, lineWidth: 0 },
        bodyStyles: { lineWidth: 0 },
        tableWidth: "auto",
        margin: { top: 28, right: 5, bottom: 10, left: 5 },
      },
    }).then(() => {
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        const header = sessionStorage.getItem("CompanyName");
        const address = sessionStorage.getItem("CompanyAddress");
        const footer = `Page ${i} of ${pageCount}`;
        const footerUrl = "www.eccountbook.com";

        if (i === 1) {
          doc.setFont("times", "italic");
          doc.setFontSize(22);
          doc.text(header, 5, 5, { baseline: "top" });

          doc.setFontSize(10);
          doc.text(address, 5, 15, { baseline: "top" });

          doc.setFont("times", "");
          doc.setFontSize(15);
          doc.text(report_Name, 5, 22, { baseline: "top" });
        }
        doc.setFontSize(10);
        doc.text(footerUrl, pageWidth / 10 - doc.getTextWidth(footer) / 2, pageHeight - 6, { baseline: "bottom" });

        doc.setFontSize(10);
        doc.text(footer, pageWidth / 2 - doc.getTextWidth(footer) / 2, pageHeight - 6, { baseline: "bottom" });
      }
      // doc.save("test.pdf");
      doc.output("dataurlnewwindow");
    });
  }

  onToolbarPreparing(event) {
    event.toolbarOptions.items.unshift(
      {
        location: "after",
        widget: "dxButton",
        options: {
          icon: "refresh",
          hint: "Refresh",
          onClick: () => this.dataGrid.instance.refresh(),
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          icon: "paste",
          hint: "Export Pdf",
          onClick: () => this.exportGrid(this.dataGrid.instance, this.pdfReportName),
        },
      }
    );
  }
}
