import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { controllers } from "chart.js";
import { DxDataGridComponent } from "devextreme-angular";
import dxDataGrid from "devextreme/ui/data_grid";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { SaleInvoiceService } from "../sale-invoice.service";

@Component({
  selector: "sal-invoice-loader",
  templateUrl: "./sal-invoice-loader.component.html",
  styleUrls: ["./sal-invoice-loader.component.scss"],
})
export class SalInvoiceLoaderComponent extends BaseActions implements OnInit {
  @ViewChild("SaleInvoiceLoaderGrid", { static: false })
  SaleInvoiceLoaderGrid: DxDataGridComponent;
  DataSource = [];

  @Output() closePopup = new EventEmitter();
  @Output() getSelectedData = new EventEmitter();
  @Input() PopupVisibile: boolean;

  constructor(private service: SaleInvoiceService) {
    super();
  }

  ngOnInit(): void {
    this.getLoaderData();
  }

  getLoaderData() {
    this.service
      .getPendingGdnsForSaleInoive({
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        DocumentTypeId: 86,
      })
      .subscribe(
        (resp) => {
          console.log("loader resp: ", resp);
          this.DataSource = resp;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  CloseLoaderPopup(){
    this.closePopup.emit("e")
  }

  loadDatafromLoader(){
    let SelectedData = this.SaleInvoiceLoaderGrid.instance.getSelectedRowsData();
    this.getSelectedData.emit(SelectedData);
  }

  DummyMethod() {}
  onToolbarPreparing = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("SaleInvoiceLoaderGrid"), this.SaleInvoiceLoaderGrid));
    this.FilterButtonInGridToolbar(e);
  };
}
