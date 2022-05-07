import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { InvFoodProductionSummaryService } from "./inv-food-production-summary.service";

@Component({
  selector: "inv-food-production-summary",
  templateUrl: "./inv-food-production-summary.component.html",
  styleUrls: [],
})
export class InvFoodProductionSummaryComponent extends BaseActions implements OnInit {
  @ViewChild("SummaryProductionGrid", { static: false })
  SummaryProductionGrid: DxDataGridComponent;
  @ViewChild("SummaryProductionDetailGrid", { static: false })
  SummaryProductionDetailGrid: DxDataGridComponent;

  jobOrderList = [];
  SummaryDataSource = [];
  SummaryDetailData = [];
  constructor(private service: InvFoodProductionSummaryService) {
    super();
    this.filter = true;
  }

  ngOnInit(): void {
    this.getAllJobOrderNumbers();
  }

  getAllJobOrderNumbers() {
    this.service
      .GetJobOrderNoForInvFoodProductionForComboBind({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (resp) => {
          this.jobOrderList = resp;
        },
        (error) => this.HandleError(error)
      );
  }

  getSummaryValues = (e) => {
    this.ActivateLoadPanel("Fetching Data!");
    this.service
      .GetSummeryValues({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        JobOrderId: e.value,
      })
      .subscribe(
        (resp) => {
          this.DeActivateLoadPanel();
          this.SummaryDataSource = resp;
        },
        (error) => {
          this.HandleError(error);
        }
      );

    this.service
      .GetSummeryDetails({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        JobOrderId: e.value,
      })
      .subscribe(
        (resp) => {
          this.DeActivateLoadPanel();
          this.SummaryDetailData = resp;
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  };

  DummyMethod() {}
  onToolbarPreparingOfSummary = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("SummaryProductionGrid"), this.SummaryProductionGrid));
    this.FilterButtonInGridToolbar(e);
  };

  onToolbarPreparingOfSummaryDetail = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("SummaryProductionDetailGrid"), this.SummaryProductionDetailGrid));
    this.FilterButtonInGridToolbar(e);
  };
}
