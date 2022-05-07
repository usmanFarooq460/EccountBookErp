import { Component, HostListener, OnInit, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { AvailableTransactionsForIssuanceModel } from "./loader-for-available-transactions-for-issuance.model";
import { BaseActions } from "../../Base/BaseActions";
@Component({
  selector: "available-transactions-loader",
  templateUrl: "./loader-for-available-transactions-for-issuance.component.html",
  styleUrls: ["./loader-for-available-transactions-for-issuance.component.scss"],
})
export class LoaderForAvailableTransactionsForIssuanceComponent extends BaseActions implements OnInit {
  //#region Variables For Handling Popup
  //===================================================================
  // ApprovalPopupHeight: number = window.innerHeight - 200;
  // ApprovalPopupWidth: number = window.innerWidth - 200;
  // ApprovalPopupGridWidth: number = window.innerWidth - 250;

  // ApprovalPopupGridHeight: number = window.innerHeight - 350;

  // @HostListener("window:resize", ["$event"])
  // onResize(event) {
  //   event.target.innerWidth;
  //   let height = event.target.innerHeight;
  //   let width = event.target.innerWidth;
  //   this.ApprovalPopupHeight = height - (height * 35) / 100;
  //   this.ApprovalPopupWidth = width - (width * 35) / 100;
  //   this.ApprovalPopupGridWidth = width - (width * 37) / 100;
  //   this.ApprovalPopupGridHeight = height - (height * 46) / 100;
  // }
  popupVisible: boolean = false;
  // filter: boolean = false;
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
  //#endregion
  @ViewChild("availableTransactionsForIssuanceGrid", { static: false })
  availableTransactionsForIssuanceGrid: DxDataGridComponent;

  @ViewChild("availableTransactionsForIssuanceForm", { static: false })
  availableTransactionsForIssuanceForm: DxFormComponent;
  availableTransactionsForIssuanceFormData: AvailableTransactionsForIssuanceModel;
  @Output() closePopup = new EventEmitter();
  @Output() getSelectedData = new EventEmitter();
  @Input() visibility: boolean;

  constructor(private commonMethods: CommonMethodsForCombos) {
    super();
  }

  async ngOnInit() {
    this.availableTransactionsForIssuanceFormData = new AvailableTransactionsForIssuanceModel();
    this.availableTransactionsForIssuanceFormData.ToDate = new Date();
    this.availableTransactionsForIssuanceFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));

    this.itemParentCategoryListFromStockEvaluation = await this.commonMethods.ParentFromInventoryStocksEvaluations();
    this.referenceDocumentListFromStockEvaluation = await this.commonMethods.DocumentTypeFromInventoryStocksEvaluations();
    this.suppliersListFromStockEvaluation = await this.commonMethods.SupplierCustomerFromInventoryStocksEvaluations();
    this.warehouseListFromStockEvaluation = await this.commonMethods.WarehouseFromInventoryStocksEvaluations();
    this.itemListFromStockEvaluation = await this.commonMethods.ItemsFromInventoryStocksEvaluations();
    this.CropYearsListFromStockEvaluation = await this.commonMethods.CropYear();
    this.jobLotListFromStockEvaluation = await this.commonMethods.JobLotFromInventoryStocksEvaluations();

    this.getAvailableDataForIssuanceOnLoad();
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
  }
  async getAvailableDataForIssuance() {
    this.availableTransactionsForIssuanceDataSource = await this.commonMethods.GetAvailableTransactionsForIssuance(this.availableTransactionsForIssuanceFormData);
  }

  async getAvailableDataForIssuanceOnLoad() {
    this.availableTransactionsForIssuanceDataSource = await this.commonMethods.GetAvailableTransactionsForIssuance({
      FromDate: this.availableTransactionsForIssuanceFormData.FromDate,
      ToDate: this.availableTransactionsForIssuanceFormData.ToDate,
      SupplierCustomerId: this.availableTransactionsForIssuanceFormData.SupplierCustomerId,
      WarehouseId: this.availableTransactionsForIssuanceFormData.WarehouseId,
      ItemId: this.availableTransactionsForIssuanceFormData.ItemId,
      RefDocumentTypeId: this.availableTransactionsForIssuanceFormData.RefDocumentTypeId,
      JobLotId: this.availableTransactionsForIssuanceFormData.JobLotId,
      InventoryParentCategories: 1,
      CropYear: this.availableTransactionsForIssuanceFormData.CropYear,
    });
  }

  DummyMethod() {}
  onToolbarPreparing = (e) => {
    this.RefreshButtonInGridToolbar(e, () =>
      this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("availableTransactionsForIssuanceGrid"), this.availableTransactionsForIssuanceGrid)
    );
    this.FilterButtonInGridToolbar(e);
  };
}
