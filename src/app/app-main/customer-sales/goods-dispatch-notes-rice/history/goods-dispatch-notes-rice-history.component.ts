import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { GoodsDispatchNoteService } from "../goods-dispatch-notes-rice.service";

@Component({
  selector: "app-goods-dispatch-notes-rice-history",
  templateUrl: "./goods-dispatch-notes-rice-history.component.html",
  styleUrls: [],
})
export class GoodsDispatchNotesRiceHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("dataGrid", { static: false })
  dataGrid: DxDataGridComponent;
  dataSource = [];
  constructor(private router: Router, private service: GoodsDispatchNoteService, private commonMethods: CommonMethodsForCombos) {
    super();
  }

  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("InvfrmGDN"));
    this.GetGivenNumberOfRecords();
  }
  onEdit(e) {
    this.UserRightsObject.canUpdate
      ? this.router.navigate(["/cus-sales/goods-dispatch-notes-form"], {
          queryParams: { Id: e.Id },
        })
      : this.ErrorPopup("You dont have Right to Update!");
  }

  gotoPurchaseOrderForm() {
    this.UserRightsObject.canSave ? this.router.navigate(["/cus-sales/goods-dispatch-notes-form"]) : this.ErrorPopup("You dont have Right to Save");
  }

  GetGivenNumberOfRecords() {
    this.GdnHistory(21);
  }
  GetAllRecords() {
    this.UserRightsObject.CanView_AllRecord ? this.GdnHistory(null) : this.ErrorPopup("You dont have Right to View All Records!");
  }

  GdnHistory(records) {
    this.ActivateLoadPanel("Fetching Data!");
    this.service
      .GrnHistory({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 86,
        CanViewAllRecord: true,
        NoOfRecord: records,
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.dataSource = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  onPrint(e) {
    this.ActivateLoadPanel("Generating Report");
    this.service
      .getpdfReport({
        // DocumentTypeId: 86,
        Id: e.Id,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId:  sessionStorage.getItem("CompanyId"),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "260-InvRptGdnRiceSlip",
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          window.open(result);
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }

  onToolbarPreparing(event) {
    this.HistoryGridToolBarPreparing(
      event,
      () => this.filtering(),
      () => this.GetAllRecords(),
      () => this.RefreshHistoryGridGrid(this.GetGivenNumberOfRecords.bind(this), this.HistoryGridSateKey("GDNHistoryGrid"), this.dataGrid)
    );
    // this.HistoryGridExpanAllRowButton(event, () => this.ExpanAllRows(this.dataGrid));
  }
}
