import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { DxDataGridComponent } from "devextreme-angular/ui/data-grid";
import { ApprovalDashboardService } from "../approval-dashboard.service";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
@Component({
  selector: "app-wsrm-requisition-order-approval",
  templateUrl: "./wsrm-requisition-order-approval.component.html",
  styleUrls: [],
})
export class WsrmRequisitionOrderApprovalComponent extends BaseActions implements OnInit {
  @ViewChild("WsrmLoaderGrid", { static: false })
  WsrmLoaderGrid: DxDataGridComponent;
  @ViewChild("WsrmRequisitionOrderApprovalDetailComponent")
  WsrmRequisitionOrderApprovalDetailComponent;
  @Input()
  WsrmRequisitioOrderApprovalPopupVisible: boolean;
  @Output() closeWsrmRequisitionOrderApprovalPopup = new EventEmitter();
  @Output() recordApproved = new EventEmitter();
  unApprovedRequistionOrderList = [];
  locationList = [];
  DestinationId: number;
  constructor(private service: ApprovalDashboardService, private commonBaseService: CommonBaseService) {
    super();
  }
  async ngOnInit() {
    this.DetailRowExpanded = true;
    this.locationList = await this.commonBaseService.getCompany();
  }
  close() {
    this.closeWsrmRequisitionOrderApprovalPopup.emit("1");
  }
  GetUpprovedRequisitionOrderList() {
    this.service
      .GetUnApprovedRequisitionOrderList({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.recordApproved.emit("1");
          this.unApprovedRequistionOrderList = [];
          this.unApprovedRequistionOrderList = result;
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  DummyMethod() {}
  onApproved(data) {
    data.DestinationLocationId = this.unApprovedRequistionOrderList.find(({ Id }) => Id == data.Id).DestinationLocationId;
    this.service.ApproveRequisitionOrder(data).subscribe(
      (result) => {
        this.SuccessPopup("Record Approved Successfully!");
        this.GetUpprovedRequisitionOrderList();
      },
      (error) => {
        if (error.ExceptionMessage) {
          this.ErrorPopup(error.ExceptionMessage);
        } else if (error.Message) {
          this.ErrorPopup(error.ExceptionMessage);
        } else {
          this.ErrorPopup(error);
        }
      }
    );
  }
  onReportSlipClick(data) {}

  onToolbarPreparing(e) {
    this.LoaderGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("WsrmSaleInvoiceLoaderGrid"), this.WsrmLoaderGrid)
    );
    this.HistoryGridExpanAllRowButton(e, () => this.ExpanAllRows(this.WsrmLoaderGrid));
  }
}
