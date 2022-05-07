import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { performaInvoiceService } from "../sample-analysis.service";

@Component({
  selector: "sample-analysis-history",
  templateUrl: "./sample-analysis-history.component.html",
  styleUrls: [],
})
export class SampleAnalysisHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("sampleAnalysisHistoryGrid", { static: false })
  sampleAnalysisHistoryGrid: DxDataGridComponent;

  dataSource = [];
  constructor(private router: Router, private service: performaInvoiceService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = false;
  }

  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("InvLabSampleAnalysis"));
    this.getSpecificNumberOfRecords();
  }

  onEdit(e) {
    this.UserRightsObject.canUpdate
      ? this.router.navigate(["/lab/sample-analysis-form"], {
          queryParams: { Id: e.Id },
        })
      : this.ErrorPopup("You dont have Right to Edit ");
  }

  gotoForm() {
    this.router.navigate(["/lab/sample-analysis-form"]);
  }

  getSpecificNumberOfRecords() {
    this.ProformaInvoiceGetAll(21);
  }
  getAllRecords() {
    this.UserRightsObject.CanView_AllRecord ? this.ProformaInvoiceGetAll(null) : this.ErrorPopup("You dont have Right to View All Records ");
  }

  ProformaInvoiceGetAll(noOfRecords) {
    this.ActivateLoadPanel("Fetching Data!");
    this.service
      .sampleAnalysisGetAll({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        NoOfRecords: noOfRecords,
        CanViewAllRecord: this.UserRightsObject.CanView_AllRecord,
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.dataSource = result;
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }

  onToolbarPreparing = (e) => {
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.getAllRecords(),
      () => this.RefreshHistoryGridGrid(this.getSpecificNumberOfRecords.bind(this), this.HistoryGridSateKey("sampleAnalysisHistoryGrid"), this.sampleAnalysisHistoryGrid)
    );
  };
}
