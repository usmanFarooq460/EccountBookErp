import { Component, OnInit, ViewChild } from "@angular/core";
import { DxTabPanelComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-inv-food-production-main",
  templateUrl: "./inv-food-production-main.component.html",
  styleUrls: [],
})
export class InvFoodProductionMainComponent extends BaseActions implements OnInit {
  @ViewChild("transactionalHistoryComponent", { static: false })
  transactionalHistoryComponent;
  @ViewChild("inputFormComponent", { static: false })
  inputFormComponent;
  @ViewChild("outputFormComponent", { static: false })
  outputFormComponent;
  @ViewChild("invFoodProductionHistoryTabPanel", { static: false })
  invFoodProductionHistoryTabPanel: DxTabPanelComponent;

  @ViewChild("ProductionPAckingTypeComponent", { static: false })
  ProductionPAckingTypeComponent;
  @ViewChild("ProductionOverHeadComponent", { static: false })
  ProductionOverHeadComponent;
  @ViewChild("ProductionSummaryComponent", { static: false })
  ProductionSummaryComponent;

  selectedIndex = 0;
  constructor(private commonMethods: CommonMethodsForCombos) {
    super();
  }

  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("FoodProductionWithValues"));
  }

  inputFormVisible: boolean;

  onInputClicked() {
    this.inputFormVisible = !this.inputFormVisible;
  }

  getRowDataForUpdate(e) {
    if (this.UserRightsObject.canUpdate) {
      if (e.EntryType == "Input") {
        this.selectedIndex = 0;
        this.inputFormComponent.setFieldsForEdit(e.Id);
      }
      if (e.EntryType == "Output") {
        this.selectedIndex = 1;
        this.outputFormComponent.setFieldsForEdit(e.Id);
      }
    } else {
      this.ErrorPopup("You Don't have Right to Update");
    }
  }

  selectedIndexCheck(e) {
    this.selectedIndex = e;
    this.inputFormComponent.resetForm();
    this.outputFormComponent.resetForm();
    this.ProductionPAckingTypeComponent.resetForm();
    this.ProductionOverHeadComponent.resetForm();
  }

  refreshHistory(e) {
    this.transactionalHistoryComponent.getAllHistoryOfInvFoodProduction();
  }
}
