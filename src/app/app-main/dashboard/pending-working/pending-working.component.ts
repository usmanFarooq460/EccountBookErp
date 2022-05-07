import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";

import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { PendingWorkingService } from "./pending-working.service.ts";
import { PendingWorkingModel } from "./pending-working.model";
import { GlobalConstant } from "src/app/Common/global-constant";
declare var mainAdminLte: any;
declare var JqueryLoaded: any;
@Component({
  selector: "app-pending-working",
  templateUrl: "./pending-working.component.html",
  styleUrls: ["./pending-working.component.css"],
})
export class PendingWorkingComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  @ViewChild("payableForm", { static: false })
  payableForm: DxFormComponent;
  pendingGatePassForGrnData = [];
  pendingGatePassForGdnData = [];
  pendingGrnForPurchaseBillData = [];
  pendingGdnForSaleBillData = [];
  //
  pendingGatepassForExportDispatchForwardingData = [];
  pendingDeliveryOrderForStockTransferData = [];
  //DECLARE VARIABLE FOR LENGTH OF PENDING RECORD
  pendingTaskForGatePassGrn: number;
  pendingTaskForGatePassGdn: number;
  pendingTaskForPurchaseBill: number;
  pendingTaskForSaleBill: number;
  pendingTaskForExportForwarding: number;
  pendingTaskForStockTransfer: number;
  constructor(private commonService: CommonBaseService, private service: PendingWorkingService) {
    super();
  }

  ngOnInit(): void {
    // this.breadCrumb("Dashboard", "Pending Working");

    this.GetPendingWorkingAllData();
    if(GlobalConstant.checkIfAdminLteIsLoadedOrNot==true)
    {
      this.callMainAdminLte();
      GlobalConstant.checkIfAdminLteIsLoadedOrNot=false;
    }
  }
  callMainAdminLte() {
    JqueryLoaded();
    mainAdminLte();
  }

  public initForm() {}

  GetPendingWorkingAllData() {
    this.service
      .pendingWorkGetAll({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.pendingGrnForPurchaseBillData = result.filter(({ PendingType }) => PendingType == "PendingForBillsPurchase");
          this.pendingGatePassForGrnData = result.filter(({ PendingType }) => PendingType == "PendingForGrn");
          this.pendingGdnForSaleBillData = result.filter(({ PendingType }) => PendingType == "PendingForBillsSale");

          this.pendingGatePassForGdnData = result.filter(({ PendingType }) => PendingType == "PendingForGDN");
          this.pendingGatepassForExportDispatchForwardingData = result.filter(({ PendingType }) => PendingType == "PendingGatepassForExportDispatchForwarding");
          this.pendingDeliveryOrderForStockTransferData = result.filter(({ PendingType }) => PendingType == "PendingDeliveryOrderForStockTransfer");

          this.getPendingTasks();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getPendingTasks() {
    this.pendingTaskForGatePassGrn = this.pendingGatePassForGrnData.length;
    this.pendingTaskForGatePassGdn = this.pendingGatePassForGdnData.length;
    this.pendingTaskForPurchaseBill = this.pendingGrnForPurchaseBillData.length;
    this.pendingTaskForSaleBill = this.pendingGdnForSaleBillData.length;
    this.pendingTaskForExportForwarding = this.pendingGatepassForExportDispatchForwardingData.length;
    this.pendingTaskForStockTransfer = this.pendingDeliveryOrderForStockTransferData.length;
  }
  onToolbarPreparing(event) {
    this.toolbarPreparing(
      event,
      () => this.dataGrid.instance.refresh(),
      () => this.exportGrid(this.dataGrid.instance)
    );
  }
}
