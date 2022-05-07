import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { ProductionJobOrderService } from "../production-job-order.service";

@Component({
  selector: "production-job-order-main-history",
  templateUrl: "./production-job-order-main-history.component.html",
  styleUrls: [],
})
export class ProductionJobOrderMainHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("productionJobOrderMainGrid", { static: false })
  productionJobOrderMainGrid: DxDataGridComponent;
  @ViewChild("productionJobOrderMainFormComponent", { static: false })
  productionJobOrderMainFormComponent;
  dataSource = [];
  selectedIndex = 0;

  constructor( private commonMethods: CommonMethodsForCombos, private service: ProductionJobOrderService) {
    super();
  }

  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("frmProductionJobOrder").catch((err) => console.log("")));
    this.getSpeficificNumberOfRecords(20);
  }

  getAllNumberOfRecords() {
    this.UserRightsObject.CanView_AllRecord ? this.getProductionHistoryData(null) : this.WarningPopup("You dont have Right to view All Record");
  }

  getSpeficificNumberOfRecords(e) {
    this.getProductionHistoryData(20);
  }

  getProductionHistoryData(noOfRecord) {
    this.ActivateLoadPanel("Fetching Data");
    this.service
      .productionJobOrderGetAll({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 403,
        NoOfRecords: noOfRecord,
        CanViewAllRecord: true,
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

  editPopup = (e) => {
    if (this.UserRightsObject.canUpdate) {
      this.productionJobOrderMainFormComponent.SetFieldsForEdit(e.Id);
      this.selectedIndex = 1;
    } else {
      this.WarningPopup("You dont have Right to Update");
    }
  };

  selectedIndexCheck = (e) => {
    this.selectedIndex = e;
  };

  CloseClickedInForm(event) {
    this.selectedIndex = 0;
    this.productionJobOrderMainFormComponent.resetForm();
  }

  goToForm() {
    if (this.UserRightsObject.canSave) {
      this.productionJobOrderMainFormComponent.resetForm();
      this.selectedIndex = 1;
    } else {
      this.WarningPopup("You dont have Right to Save");
    }
  }

  onToolPreparingOfHistoryGrid = (e) => {
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.getAllNumberOfRecords(),
      () => this.RefreshHistoryGridGrid(this.dummy.bind(this), this.HistoryGridSateKey("productionJobOrderMainGrid"), this.productionJobOrderMainGrid)
    );
  };

  dummy() {}
}
