import { Component, HostListener, OnInit, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { AvailableTransactionsForIssuanceModel } from "./loader-for-available-stock-against-qty-for-issuance.model";
import { StockAgainstQtyForIssuanceLoaderService } from "./loader-for-available-stock-against-qty-for-issuance.service";
@Component({
  selector: "stock-against-quantity-loader",
  templateUrl: "./loader-for-available-stock-against-qty-for-issuance.component.html",
  styleUrls: ["./loader-for-available-stock-against-qty-for-issuance.component.scss"],
})
export class StockAgainstQtyForIssuanceLoaderComponent implements OnInit {
  //#region Variables For Handling Popup
  //===================================================================
  ApprovalPopupHeight: number = window.innerHeight - 200;
  ApprovalPopupWidth: number = window.innerWidth - 200;
  ApprovalPopupGridWidth: number = window.innerWidth - 250;

  ApprovalPopupGridHeight: number = window.innerHeight - 350;
  heightForColumnContainingForm: any = (this.ApprovalPopupHeight * 20) / 100 + "px";
  heightForColumnContainingGrid: any = (this.ApprovalPopupHeight * 72) / 100 + "px";

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    event.target.innerWidth;
    let height = event.target.innerHeight;
    let width = event.target.innerWidth;
    this.ApprovalPopupHeight = height - (height * 35) / 100;
    this.ApprovalPopupWidth = width - (width * 35) / 100;
    this.ApprovalPopupGridWidth = width - (width * 37) / 100;
    this.ApprovalPopupGridHeight = height - (height * 46) / 100;
    this.heightForColumnContainingForm = (this.ApprovalPopupHeight * 20) / 100 + "px";
    this.heightForColumnContainingGrid = (this.ApprovalPopupHeight * 72) / 100 + "px";
  }
  popupVisible: boolean = false;
  filter: boolean = false;
  //#endregion

  //#region DataListVariables
  availableTransactionsForIssuanceDataSource = [];
  suppliersListFromStockEvaluation: any;
  itemParentCategoryListFromStockEvaluation: any;
  jobLotListFromStockEvaluation: any;
  referenceDocumentListFromStockEvaluation: any;
  warehouseListFromStockEvaluation: any;
  itemListFromStockEvaluation: any;
  CropYearsListFromStockEvaluation: any;
  loadPanelVisible: boolean = false;
  loadPanelMessage: string = "Loading Data......";

  //#endregion
  @ViewChild("availableTransactionsForIssuanceGrid", { static: false })
  availableTransactionsForIssuanceGrid: DxDataGridComponent;

  @ViewChild("availableTransactionsForIssuanceForm", { static: false })
  availableTransactionsForIssuanceForm: DxFormComponent;
  availableTransactionsForIssuanceFormData: AvailableTransactionsForIssuanceModel;
  @Output() closePopup = new EventEmitter();
  @Output() getSelectedData = new EventEmitter();
  @Input() visibility: boolean;

  constructor(private commonMethods: CommonMethodsForCombos, private service: StockAgainstQtyForIssuanceLoaderService) {}

  async ngOnInit() {
    console.log("hamza");
    this.availableTransactionsForIssuanceFormData = new AvailableTransactionsForIssuanceModel();
    this.availableTransactionsForIssuanceFormData.ToDate = new Date();
    this.availableTransactionsForIssuanceFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.getAvailableDataForIssuanceOnLoad();
    this.loadData();
  }
  async loadData() {
    console.log("laoding data");
    this.loadPanelVisible = true;
    this.itemParentCategoryListFromStockEvaluation = await this.commonMethods.ParentFromInventoryStocksEvaluations();
    this.warehouseListFromStockEvaluation = await this.commonMethods.WarehouseFromInventoryStocksEvaluations();
    this.itemListFromStockEvaluation = await this.commonMethods.ItemsFromInventoryStocksEvaluations();
    this.CropYearsListFromStockEvaluation = await this.commonMethods.CropYear();
    this.jobLotListFromStockEvaluation = await this.commonMethods.JobLotFromInventoryStocksEvaluations();
    this.loadPanelVisible = false;
  }

  loadPopup() {
    this.closePopup.emit("false");
  }
  filtering() {
    this.filter = !this.filter;
  }

  TransferDataAgainstSelectedRecord() {
    let SelectedData = this.availableTransactionsForIssuanceGrid.instance.getSelectedRowsData();
    this.getSelectedData.emit(SelectedData);
    this.availableTransactionsForIssuanceGrid.instance.clearSelection();
  }

  getAvailableDataForIssuanceOnLoad() {
    this.service
      .GetAvailableStockAgainstQty({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ItemCategoryId: this.availableTransactionsForIssuanceFormData.InventoryParentCategories,
        ToDate: this.availableTransactionsForIssuanceFormData.ToDate,
        WarehouseId: this.availableTransactionsForIssuanceFormData.WarehouseId,
        ItemId: this.availableTransactionsForIssuanceFormData.ItemId,
        JobLotId: this.availableTransactionsForIssuanceFormData.JobLotId,
      })
      .subscribe(
        (result) => {
          for (let i = 0; i < result.length; i++) {
            result[i].Identity = i + 1;
          }
          this.availableTransactionsForIssuanceDataSource = result;
          console.log(this.availableTransactionsForIssuanceDataSource);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
