import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges } from "@angular/core";
import { DxFormComponent, DxDataGridComponent } from "devextreme-angular";
import { WsrmRequisitionOrderDetailModel, WsrmRequistionOrderModel } from "./wsrm-requisition-order-approval.model";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { ApprovalDashboardService } from "../../approval-dashboard.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";

@Component({
  selector: "wsrm-requisition-order-approval-detail",
  templateUrl: "./wsrm-requisition-order-approval-detail.component.html",
  styleUrls: ["./wsrm-requisition-order-approval-detail.scss"],
})
export class WsrmRequisitionOrderApprovalDetailComponent extends BaseActions implements OnInit {
  @ViewChild("WsrmRequisitionOrderApprovalForm", { static: false })
  WsrmRequisitionOrderApprovalForm: DxFormComponent;
  WsrmRequisitionOrderApprovalFormData: WsrmRequistionOrderModel;

  @ViewChild("WsrmRequisitionOrderApprovalDetailGrid", { static: false })
  WsrmRequisitionOrderApprovalDetailGrid: DxDataGridComponent;

  @Input() rowData: any;

  @Output() ApproveData = new EventEmitter();
  locationList = [];
  reqStatusList = [];
  wsrmRequisitionOrderDetailList = new Array<WsrmRequisitionOrderDetailModel>();
  confirmationPopupVisible: boolean = false;
  confirmationPopupMessage = "";

  constructor(private commonService: CommonBaseService, private commonMethods: CommonMethodsForCombos, private service: ApprovalDashboardService) {
    super();
  }

  async ngOnInit() {
    this.locationList = await this.commonService.getCompany();
    this.reqStatusList = await this.commonMethods.GetStaticColumnNamesByActivity("WsrmRequisitonStatusList");
    this.GetById();
  }

  onInit() {
    this.WsrmRequisitionOrderApprovalFormData = new WsrmRequistionOrderModel();
    this.WsrmRequisitionOrderApprovalFormData.ReqStatus = this.reqStatusList[1].Id;
  }
  handleApprovedQtyChangeInDetailGrid = (newData, value, currentRowData) => {
    let qty = 0;
    let rate = 0;
    let itemAmount = 0;
    if (value > 0) {
      if (value > currentRowData.ReqQty) {
        this.WarningPopup("You cannot Approve more than Requested Quantity!");
        return;
      }

      qty = value;
    } else if (value <= 0 || value == undefined || value == null) {
      console.log("value is ladkjsflkdjf");
      this.WarningPopup("Approved Quantity must be greater than ZERO!");
      return;
    }
    if (currentRowData.ReqRate > 0) {
      rate = currentRowData.ReqRate;
    }

    newData.ApprovedQty = qty;
    itemAmount = qty * rate;
    newData.ReqAmount = parseFloat(itemAmount.toFixed(2));
  };

  GetById() {
    this.service.GetRequisitionOrderById(this.rowData.Id).subscribe(
      (result: any) => {
        console.log(result);
        this.WsrmRequisitionOrderApprovalFormData = result;
        this.wsrmRequisitionOrderDetailList = [];
        let data = result.WsRmRequisitionPoDetailsList;
        for (let i = 0; i < data.length; i++) {
          data[i].ApprovedQty = data[i].ReqQty;
        }

        this.wsrmRequisitionOrderDetailList = data;
      },

      (error) => {
        console.log(error);
      }
    );
  }
  handleYesNoClicked(e) {
    if (e == "true") {
      this.WsrmRequisitionOrderApprovalFormData.ApprovedDate = new Date();
      this.WsrmRequisitionOrderApprovalFormData.ApprovedUserId = parseInt(sessionStorage.getItem("UserId"));
      this.WsrmRequisitionOrderApprovalFormData.HoApprovalDate = new Date();
      this.WsrmRequisitionOrderApprovalFormData.HoApprovedUserId = parseInt(sessionStorage.getItem("UserId"));
      this.WsrmRequisitionOrderApprovalFormData.IsApproved = true;
      this.WsrmRequisitionOrderApprovalFormData.HoIsApproved = true;
      this.WsrmRequisitionOrderApprovalFormData.ReqStatus = 2;
      this.WsrmRequisitionOrderApprovalFormData.WsRmRequisitionPoDetailsList = this.wsrmRequisitionOrderDetailList;
      this.confirmationPopupVisible = false;

      this.ApproveData.emit(this.WsrmRequisitionOrderApprovalFormData);
    } else {
      this.confirmationPopupVisible = false;
    }
  }
  approveRequisitionOrder() {
    this.confirmationPopupMessage = "Do you want to Approve?";
    this.confirmationPopupVisible = true;
  }
}
