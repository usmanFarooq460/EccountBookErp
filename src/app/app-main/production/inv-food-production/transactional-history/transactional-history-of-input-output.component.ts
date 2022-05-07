import { Component, OnInit, Output, ViewChild, EventEmitter } from "@angular/core";
import { DxDataGridComponent, DxTabPanelComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { InvFoodProductionService } from "../inv-food-production.service";

@Component({
  selector: "app-transactional-history-of-input-output",
  templateUrl: "./transactional-history-of-input-output.component.html",
  styleUrls: [],
})
export class TransactionalHistoryOfInputOutputComponent extends BaseActions implements OnInit {
  @ViewChild("invfoodProductionInputHistoryGrid", { static: false })
  invfoodProductionInputHistoryGrid: DxDataGridComponent;
  @ViewChild("invFoodProductionInputTabPanelHistory", { static: false })
  invFoodProductionInputTabPanelHistory: DxTabPanelComponent;
  @ViewChild("invFoodProductionInputComponent", { static: false })
  invFoodProductionInputComponent;

  @Output() rowDataToUpdate = new EventEmitter();

  dataSource = [];
  selectedIndex = 0;
  constructor(private service: InvFoodProductionService, private commonMethods: CommonMethodsForCombos) {
    super();
  }

  async ngOnInit() {
    this.getAllHistoryOfInvFoodProduction();
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("FoodProductionWithValues").catch((err) => console.log(err)));
  }

  editForm = (e) => {
    this.UserRightsObject.canUpdate ? this.rowDataToUpdate.emit(e) : this.ErrorPopup("You don't have Right to Update");
  };

  getAllHistoryOfInvFoodProduction() {
    this.ActivateLoadPanel("Fetching Data!");
    this.service
      .FormHistoryOfInvFoodProduction({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 80,
      })
      .subscribe(
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

  DummyMethod() {}
  onToolbarPreparing = (e) => {
    this.RefreshButtonInGridToolbar(e, () =>
      this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("invfoodProductionInputHistoryGrid"), this.invfoodProductionInputHistoryGrid)
    );
    this.FilterButtonInGridToolbar(e);
  };
}
