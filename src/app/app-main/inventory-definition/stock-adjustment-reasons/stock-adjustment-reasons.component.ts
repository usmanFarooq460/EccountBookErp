import { ThrowStmt } from "@angular/compiler";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Console } from "console";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { parse } from "path";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { validate } from "src/app/shared/Base/validationHelper";
import { defineStockAdjustmentReasonsModel } from "./stock-adjustment-reasons.model";
import { StockAdjustmentReasonsService } from "./stock-adjustment-reasons.service";

@Component({
  selector: "stock-adjustment-reasons",
  templateUrl: "./stock-adjustment-reasons.component.html",
  styleUrls: [],
})
export class StockAdjustmentReasonsComponent extends BaseActions implements OnInit {
  @ViewChild("defineStockAdjustmentReasonsForm", { static: false })
  defineStockAdjustmentReasonsForm: DxFormComponent;
  defineStockAdjustmentReasonsFormData: defineStockAdjustmentReasonsModel;
  @ViewChild("defineStockAdjustmentReasonsGrid", { static: false })
  defineStockAdjustmentReasonsGrid: DxDataGridComponent;

  showHideFormPopup: boolean;
  dataSource = [];

  @Input() IsLoadedInPopup: boolean = false;
  @Input() SomeElementsVisible: boolean = true;

  constructor(private service: StockAdjustmentReasonsService) {
    super();
  }

  ngOnInit(): void {
    this.breadCrumb("Wsrm Reports", "Define Stock Adjustment Reasons");
    this.getHistoryForStockAdjustmentReasons();
    this.initForm();
  }

  initForm() {
    this.defineStockAdjustmentReasonsFormData = new defineStockAdjustmentReasonsModel();
  }

  editPopup = (e) => {
    this.service.GetByID(e.Id).subscribe(
      (resp) => {
        this.defineStockAdjustmentReasonsFormData = resp;
        this.showHideFormPopup = true;
      },
      (error) => {
        this.HandleError(error);
      }
    );
  };

  getHistoryForStockAdjustmentReasons() {
    this.ActivateLoadPanel("Loading Data!");
    this.service.getHistoryOfDrmLookups(11).subscribe(
      (resp) => {
        this.DeActivateLoadPanel();
        this.dataSource = resp;
      },
      (error) => {
        this.DeActivateLoadPanel();
        this.HandleError(error);
      }
    );
  }

  handleFormPopupVisibility() {
    this.showHideFormPopup = !this.showHideFormPopup;
    this.initForm();
  }

  onSave() {
    if (validate(this.defineStockAdjustmentReasonsForm)) {
      this.defineStockAdjustmentReasonsFormData.FormulaForPriceTypeId = 0;
      this.defineStockAdjustmentReasonsFormData.LookUpTypeId = 11;
      this.defineStockAdjustmentReasonsFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.defineStockAdjustmentReasonsFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));

      this.defineStockAdjustmentReasonsFormData.Id > 0 ? this.ActivateLoadPanel("Submitting") : this.ActivateLoadPanel("Updating");
      this.service.save(this.defineStockAdjustmentReasonsFormData).subscribe(
        (resp) => {
          this.DeActivateLoadPanel();
          this.defineStockAdjustmentReasonsFormData.Id > 0 ? this.SuccessPopup("Data has Updated Successfully") : this.SuccessPopup("Data has Submitted Successfully");
          this.getHistoryForStockAdjustmentReasons();
          this.handleFormPopupVisibility();
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
    }
  }

  DummyMethod() {}
  onToolbarPreparing = (e) => {
    this.RefreshButtonInGridToolbar(e, () =>
      this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("defineStockAdjustmentReasonsGrid"), this.defineStockAdjustmentReasonsGrid)
    );
    this.FilterButtonInGridToolbar(e);
  };
}
