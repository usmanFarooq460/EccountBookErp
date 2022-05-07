import { Component, HostListener, OnInit, ViewChild, Input } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { ApprovalDashboardService } from "./approval-dashboard.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import notify from "devextreme/ui/notify";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { ApprovalDashboardModel, DeliveryOrderHeaderArray } from "./approval-dashboard.model";

@Component({
  selector: "app-approval-dashboard",
  templateUrl: "./approval-dashboard.component.html",
  styleUrls: ["./approval-dashboard.component.scss"],
})
export class ApprovalDashboardComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  @ViewChild(DxDataGridComponent, { static: false })
  UnApprovedDeliveryOrderGrid: DxDataGridComponent;

  @ViewChild("ApprovalDasboardForm", { static: false })
  ApprovalDasboardForm: DxFormComponent;
  ApprovalDasboardFormData: ApprovalDashboardModel;
  InventoryTableDataSource;
  dataSource = [];
  popupDataSource: any;
  loadStatus: boolean = false;
  LoadDelivery: boolean;
  DeliveryOrderStatus: boolean = false;
  purchaseinvoiceStatus: boolean = false;
  purchaseorderStatus: boolean;
  saleinvoiceStatus: boolean = false;
  AccountsApprovalDocumetnTypeId: number;
  supplierList: any;
  ItemsList: any;
  hideMe: boolean = false;
  //   window.addEventListener('resize', function(event){
  //     var newWidth = window.innerWidth;
  //     var newHeight = window.innerHeight;
  // });
  //=================================================================================
  //@hamza
  // ApprovalPopupHeight: number = window.innerHeight - 150;
  // ApprovalPopupWidth: number = window.innerWidth - 150;
  // ApprovalPopupGridWidth: number = window.innerWidth - 200;

  // ApprovalPopupGridHeight: number = window.innerHeight - 220;

  // //Height and Width for Delivery Order (There)

  // @HostListener("window:resize", ["$event"])
  // onResize(event) {
  //   event.target.innerWidth;
  //   let height = event.target.innerHeight;
  //   let width = event.target.innerWidth;
  //   this.ApprovalPopupHeight = height - (height * 20) / 100;
  //   this.ApprovalPopupWidth = width - (width * 20) / 100;
  //   this.ApprovalPopupGridWidth = width - (width * 23) / 100;
  //   this.ApprovalPopupGridHeight = height - (height * 27) / 100;
  // }
  // accountsApprovalGridPageSize: any;
  filter: boolean = false;
  purchaseInvoiceApprovalGridPageSize: any;
  saleInvoiceApprovalGridPageSize: any;
  DeleiveryOrderApprovalGridPageSize: any;
  unApprovedPurchaseOrderList = [];
  purchaseOrderApprovalGridPageSize: any;
  deliveryOrderApprovalHeaderArray = new Array<DeliveryOrderHeaderArray>();
  GatePassOutwardApprovalPopupVisible: boolean = false;
  GatePassOutwardDataPendingForApproval = [];
  GatePassOutwardApprovalGridPageSize: any;
  GatePassOutwardGeneraDataPendingForApproval = [];
  GatePassOutwardGeneralApprovalPopupGridPageSize: any;
  UnApprovedSupplyOrderList = [];
  supplyOrderApprovalPopupGirdPageSize: any;
  SupplyOrderApprovalConfirmationPopupVisibility: boolean = false;
  SupplyOrderApprovalPopupVisible: boolean = false;

  //@hamza
  //================================================================================
  invoicepurchaseDocTypeId: number;
  invoicesaleDocTypeId: number;
  purchaseInvoiceDataSource = [];
  purchaseORderDataSource = [];
  saleInvoiceDataSource: [];
  DeliveryOrderList = [];
  UnApprovedSaleOrderList = [];

  //===================================
  confirmationForVoucherVisible: boolean = false;
  checkIfApprovalIsConfirmed: boolean;
  ApprovalRowData: any;

  //==================================
  PurchaseOrderConfirmationVisible: boolean = false;
  PurchaseInvoiceConfirmationVisible: boolean = false;
  SaleInvoiceConfirmationVisible: boolean = false;
  SaleOrderConfirmationVisible: boolean = false;
  DeleiveryOrderConfirmationVisible: boolean = false;
  OutwardGatePassConfirmationVisible: boolean = false;
  OutwardGatePassGeneralConfirmationVisible: boolean = false;

  GatePassOutwardGeneralApprovalPopupVisible: boolean = false;
  saleOrderApprovalPopupVisible: boolean = false;
  deleiveryOrderApprovalConfirmationVisisble: boolean = false;
  //==========================================================================================================
  @ViewChild("WsrmRequisitionOrderApprovalComponent")
  WsrmRequisitionOrderApprovalComponent;
  WsrmRequisitionOrdePopupVisible: boolean = false;

  AccountsApprovalPopupHeading: string = "";
  SaleOrderApprovalPopupVisible: boolean = false;
  @ViewChild("SaleOrderApprovalComponent")
  SaleOrderApprovalComponent;
  SaleInvoiceApprovalPopupVisible: boolean = false;
  @ViewChild("SaleInoviceApprovalComponent")
  SaleInoviceApprovalComponent;
  //===================================

  NewApprovalPopupVisible: boolean = false;
  //===================================

  //======================================

  //==========================================================================================================

  @ViewChild("SaleReturnTradingApprovalComponent")
  SaleReturnTradingApprovalComponent;
  SaleReturnTradingApprovalPopupVisible: boolean = false;
  //==========================================================================================================

  //==========================================================================================================
  @Input() CompanyId: number;
  @Input() FinancialYearId: number;
  @Input() IsLoadedInOtherComponent: boolean = false;
  @Input() ApprovalPopupHeading: string;

  //==========================================================================================================
  ApprovalPopupVisible: boolean = false;
  ApprovalPopupCompnentList = [
    {
      Id: 0,
      Label: "AccountsApproval",
      Status: false,
    },
    {
      Id: 1,
      Label: "Wsrm Sale Invoice",
      Status: false,
    },
    {
      Id: 2,
      Label: "Purchase Invoice",
      Status: false,
    },
    {
      Id: 3,
      Label: "Wsrm Sale Order",
      Status: false,
    },
    {
      Id: 4,
      Label: "Purchase Order",
      Status: false,
    },
    {
      Id: 5,
      Label: "Import Contract",
      Status: false,
    },
    {
      Id: 6,
      Label: "Import Purchase Order",
      Status: false,
    },
    {
      Id: 7,
      Label: "Import Invoice",
      Status: false,
    },
    {
      Id: 8,
      Label: "Purchase Return",
      Status: false,
    },
  ];
  InventoryApprovalHeading: string;

  constructor(private service: ApprovalDashboardService, private commonMethods: CommonMethodsForCombos, private router: Router, private commonService: CommonBaseService) {
    super();
    this.popoverVisible = false;
  }

  async ngOnInit() {
    this.breadCrumb("Approval Dashboard", "");
    await this.FetchData();

    this.ApprovalDasboardFormData = new ApprovalDashboardModel();
    this.ApprovalDasboardFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.ApprovalDasboardFormData.ToDate = new Date();
    this.CustomerAccount();
    this.getDeliveryOrderRecordForApproved();
    this.ItemGetAll();
  }

  async FetchData() {
    this.ActivateLoadPanel("Fetching Company Approvals!");

    await this.GetInventoryUnApproved();
    await this.GetAccountsUnApprovedCount();
    this.DeActivateLoadPanel();
  }
  handleApprovalPopupVisibility(Index) {
    if (Index == 100) {
      for (let i = 0; i < this.ApprovalPopupCompnentList.length; i++) {
        this.ApprovalPopupCompnentList[i].Status = false;
      }
    } else {
      this.ApprovalPopupCompnentList[Index].Status = true;
    }
    this.ApprovalPopupVisible = !this.ApprovalPopupVisible;
  }
  //GetAccountsUnApproved
  //==================================================================
  handleWsrmRequisitionOrderPopupVisibility(e) {
    this.WsrmRequisitionOrdePopupVisible = !this.WsrmRequisitionOrdePopupVisible;
    if (this.WsrmRequisitionOrdePopupVisible == true) {
      this.WsrmRequisitionOrderApprovalComponent.GetUpprovedRequisitionOrderList();
    }
  }

  handleSaleOrderApprovalPopupVisibility(e) {
    this.SaleOrderApprovalPopupVisible = !this.SaleOrderApprovalPopupVisible;
    if (this.SaleOrderApprovalPopupVisible == true) {
      this.SaleOrderApprovalComponent.GetUnApprovedSaleOrders(this.invoicesaleDocTypeId);
    }
  }
  handleInventoryApproval(e) {
    this.GetInventoryUnApproved();
  }
  handleSaleInvoiceApporvalPopupVisibility(e) {
    this.SaleInvoiceApprovalPopupVisible = !this.SaleInvoiceApprovalPopupVisible;
    if (this.SaleInvoiceApprovalPopupVisible == true) {
      this.SaleInoviceApprovalComponent.GetUnApprovedRecord(this.invoicesaleDocTypeId);
    }
  }

  handleSaleReturnTradingApprovalPopupVisibility(e) {
    this.SaleReturnTradingApprovalPopupVisible = !this.SaleReturnTradingApprovalPopupVisible;
    if (this.SaleReturnTradingApprovalPopupVisible == true) {
      this.SaleReturnTradingApprovalComponent.GetUnApprovedData();
    }
  }

  //======================================================================
  //----------------------------------------17 Feb-2022----------------------------------------

  //----------------------------------------17 Feb-2022----------------------------------------
  refreshInventoryApprovalData(e) {
    this.GetInventoryUnApproved();
  }
  filtering() {
    this.filter = !this.filter;
  }
  closeAccountsPopupGrid() {
    this.loadStatus = !this.loadStatus;
    this.filter = false;
  }
  closePurchaseInvoicePopupGrid() {
    this.purchaseinvoiceStatus = !this.purchaseinvoiceStatus;
    this.filter = false;
  }
  closeSaleInvoicePopupGrid() {
    this.saleinvoiceStatus = !this.saleinvoiceStatus;
    this.filter = false;
  }
  closeDeleiveryOrderPopupGrid() {
    this.DeliveryOrderStatus = !this.DeliveryOrderStatus;
    this.filter = false;
  }
  closePurchaseOrderPopupGrid() {
    this.purchaseorderStatus = !this.purchaseorderStatus;
    this.filter = false;
  }
  AccountsEdit(e) {
    if (e.Count > 0) {
      if (e.TypeID == 0) {
        this.AccountsApprovalDocumetnTypeId = 1;
      }
      if (e.TypeID == 1) {
        this.AccountsApprovalDocumetnTypeId = 2;
      }
      if (e.TypeID == 2) {
        this.AccountsApprovalDocumetnTypeId = 3;
      }
      if (e.TypeID == 3) {
        this.AccountsApprovalDocumetnTypeId = 4;
      }
      if (e.TypeID == 4) {
        this.AccountsApprovalDocumetnTypeId = 6;
      }
      if (e.TypeID == 5) {
        this.AccountsApprovalDocumetnTypeId = 7;
      }
      if (e.TypeID == 6) {
        this.AccountsApprovalDocumetnTypeId = 10;
      }
      if (e.TypeID == 7) {
        this.AccountsApprovalDocumetnTypeId = 26;
      }
      this.AccountsApprovalPopupHeading = e.VoucherType;
      // this.purchaseinvoiceStatus = false;
      // this.saleinvoiceStatus = false;
      // this.purchaseorderStatus = false;
      this.handleApprovalPopupVisibility(0);
      // if (this.ApprovalPopupCompnentList[0].Status == true) {
      //   this.AccountsApprovalComponent.getUnApprovedAccountsDataByDocTypeId(this.docTypeId);
      // }
    } else {
      notify("No Record For Approved!", "error");
      return;
    }
  }
  //#region  Confirmation Popup

  handleAccountsApprovalPopupVisibility(e) {
    this.loadStatus = !this.loadStatus;
    // if (this.loadStatus == true) {
    //   this.AccountsApprovalComponent.getUnApprovedAccountsDataByDocTypeId(this.docTypeId);
    // }
  }
  handleAccountsRecordApproved(e) {
    this.GetAccountsUnApprovedCount();
  }
  //--------------------------------------
  DOaccepted() {
    this.ApprovedRecordByDeliveryOrderId(this.ApprovalRowData);
    this.deleiveryOrderApprovalConfirmationVisisble = !this.deleiveryOrderApprovalConfirmationVisisble;
    this.GetInventoryUnApproved();
  }
  DOrejected() {
    this.deleiveryOrderApprovalConfirmationVisisble = !this.deleiveryOrderApprovalConfirmationVisisble;
  }
  DOeditClick(e) {
    this.deleiveryOrderApprovalConfirmationVisisble = !this.deleiveryOrderApprovalConfirmationVisisble;
    this.ApprovalRowData = e;
  }
  //--------------------------------------
  POaccepted() {
    this.onApprovedPurchaseOrder(this.ApprovalRowData);
    this.PurchaseOrderConfirmationVisible = !this.PurchaseOrderConfirmationVisible;
    this.GetInventoryUnApproved();
  }
  POrejected() {
    this.PurchaseOrderConfirmationVisible = !this.PurchaseOrderConfirmationVisible;
    this.GetInventoryUnApproved();
  }
  POeditClick(e) {
    this.PurchaseOrderConfirmationVisible = !this.PurchaseOrderConfirmationVisible;
    this.ApprovalRowData = e;
  }
  //--------------------------------------

  PIaccepted() {
    this.PurchaseInvoiceConfirmationVisible = !this.PurchaseInvoiceConfirmationVisible;
    this.onPurchaseInvoiceApproved(this.ApprovalRowData);
  }
  PIrejected() {
    this.PurchaseInvoiceConfirmationVisible = !this.PurchaseInvoiceConfirmationVisible;
  }
  PIeditClick(e) {
    this.PurchaseInvoiceConfirmationVisible = !this.PurchaseInvoiceConfirmationVisible;
    this.ApprovalRowData = e;
  }
  //--------------------------------------
  SIaccepted() {
    this.SaleInvoiceConfirmationVisible = !this.SaleInvoiceConfirmationVisible;
    this.onSaleInvoiceApproved(this.ApprovalRowData);
  }
  SIrejected() {
    this.SaleInvoiceConfirmationVisible = !this.SaleInvoiceConfirmationVisible;
  }
  SIeditClick(e) {
    this.SaleInvoiceConfirmationVisible = !this.SaleInvoiceConfirmationVisible;
    this.ApprovalRowData = e;
  }
  //--------------------------------------
  SOaccepted() {
    this.SaleOrderConfirmationVisible = !this.SaleOrderConfirmationVisible;
    this.ApproveSaleOrder(this.ApprovalRowData);
  }
  SOrejected() {
    this.SaleOrderConfirmationVisible = !this.SaleOrderConfirmationVisible;
  }
  SOeditClick(e) {
    this.SaleOrderConfirmationVisible = !this.SaleOrderConfirmationVisible;
    this.ApprovalRowData = e;
  }
  //--------------------------------------
  OGPaccepted() {
    this.OutwardGatePassConfirmationVisible = !this.OutwardGatePassConfirmationVisible;
    this.ApproveGatePassOutward(this.ApprovalRowData);
  }
  OGPrejected() {
    this.OutwardGatePassConfirmationVisible = !this.OutwardGatePassConfirmationVisible;
  }
  OGPeditClick(e) {
    this.PendingGatePassForApproval();
    this.OutwardGatePassConfirmationVisible = !this.OutwardGatePassConfirmationVisible;
    this.ApprovalRowData = e;
  }
  //--------------------------------------
  OGPGaccepted() {
    this.ApproveGatePassOutwardGeneral(this.ApprovalRowData);
    this.OutwardGatePassGeneralConfirmationVisible = !this.OutwardGatePassGeneralConfirmationVisible;
  }
  OGPGrejected() {
    this.OutwardGatePassGeneralConfirmationVisible = !this.OutwardGatePassGeneralConfirmationVisible;
  }
  OGPGeditClick(e) {
    this.PendingGatePassGeneralForApproval();
    this.OutwardGatePassGeneralConfirmationVisible = !this.OutwardGatePassGeneralConfirmationVisible;
    this.ApprovalRowData = e;
  }
  //--------------------------------------

  SupplyOrderAccepted() {
    this.ApproveSelectedSupplyOrder(this.ApprovalRowData);
    this.SupplyOrderApprovalConfirmationPopupVisibility = !this.SupplyOrderApprovalConfirmationPopupVisibility;
  }
  SupplyOrderRejected() {
    this.SupplyOrderApprovalConfirmationPopupVisibility = !this.SupplyOrderApprovalConfirmationPopupVisibility;
  }
  SupplyOrderEditClick(e) {
    this.SupplyOrderApprovalConfirmationPopupVisibility = !this.SupplyOrderApprovalConfirmationPopupVisibility;
    this.ApprovalRowData = e;
  }
  colseSaleOrderApprovalPopup() {
    this.saleOrderApprovalPopupVisible = false;
  }

  //--------------------------------------

  //#endregion
  async RefrehDashboard() {
    this.ActivateLoadPanel("Refreshing!");
    await this.GetInventoryUnApproved();
    await this.GetAccountsUnApprovedCount();
    this.DeActivateLoadPanel();
  }
  //#region
  PendingGatePassForApproval() {
    this.service
      .PendingGatePassForApproval({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FromDate: sessionStorage.getItem("StartPeriod"),
        ToDate: new Date(),
      })
      .subscribe(
        (result) => {
          this.GatePassOutwardDataPendingForApproval = result;
          this.GatePassOutwardApprovalGridPageSize = [result.length];
        },
        (error) => {
          console.log(error);
        }
      );
  }
  ApproveGatePassOutward(e) {
    this.service
      .ApproveGatePassOutward({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 91,
        Id: e.Id,
        EntryUser: sessionStorage.getItem("UserId"),
      })
      .subscribe(
        (result) => {
          this.PendingGatePassForApproval();
          this.GetInventoryUnApproved();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  closeGatePassOutwardPopupGrid() {
    this.GatePassOutwardApprovalPopupVisible = !this.GatePassOutwardApprovalPopupVisible;
  }
  closeSupplyOrderApprovalPopup() {
    this.SupplyOrderApprovalPopupVisible = false;
  }
  getSupplyOrderUnapproved() {
    this.service
      .UnApprovedSupplyOrderForDashboard({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.UnApprovedSupplyOrderList = result;
          this.supplyOrderApprovalPopupGirdPageSize = [20, result.length];
        },
        (error) => {
          console.log(error);
        }
      );
  }
  SupplyOrderReportSlip330 = (e) => {
    this.service
      .getPurchaseSupplyOrderPdfReportSlip330({
        Id: e.Id,
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "330-InvSupplyOrderSlip",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => console.log(error)
      );
  };
  ApproveSelectedSupplyOrder = (e) => {
    this.service
      .ApproveSupplyOrderAgainstSelectedId({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        EntryUser: sessionStorage.getItem("UserId"),
        Id: e.Id,
      })
      .subscribe(
        (result) => {
          this.GetInventoryUnApproved();
          this.getSupplyOrderUnapproved();
        },
        (error) => {
          console.log(error);
        }
      );
  };
  ApproveSaleOrder(e) {
    if (e.IsApproved != "Approved") {
      this.service
        .AppoveSaleOrder({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          ReqType: "Approve",
          Id: e.Id,
        })
        .subscribe(
          (result) => {
            notify("Record Approved successfully!", "success");
            this.GetUnApprovedSaleOrders();
            this.GetInventoryUnApproved();
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      notify("Record Already Approved", "error");
    }
  }

  //#endregion
  InventoryEdit(e) {
    if (e.Count > 0) {
      if (e.TypeID == 41) {
        this.saleinvoiceStatus = false;
        this.loadStatus = false;
        this.purchaseorderStatus = false;
        this.purchaseinvoiceStatus = false;
        this.invoicepurchaseDocTypeId = null;
        this.SupplyOrderApprovalPopupVisible = true;
        this.getSupplyOrderUnapproved();
      }
      if (e.TypeID == 23) {
        this.saleinvoiceStatus = false;
        this.loadStatus = false;
        this.purchaseorderStatus = false;
        this.purchaseinvoiceStatus = true;
        this.invoicepurchaseDocTypeId = null;
        this.invoicepurchaseDocTypeId = 56;
        this.getPurchaseInvocieUnApprovedRecord();
      }
      if (e.TypeID == 24) {
        this.loadStatus = false;
        this.saleinvoiceStatus = false;
        this.purchaseorderStatus = false;
        this.purchaseinvoiceStatus = true;
        this.invoicepurchaseDocTypeId = null;
        this.invoicepurchaseDocTypeId = 57;
        this.getPurchaseInvocieUnApprovedRecord();
      }
      if (e.TypeID == 28) {
        this.saleinvoiceStatus = false;
        this.loadStatus = false;
        this.purchaseorderStatus = false;
        this.purchaseinvoiceStatus = false;
        this.invoicepurchaseDocTypeId = null;
        this.saleOrderApprovalPopupVisible = true;
        this.handleSaleOrderApprovalPopupVisibility(1);
      }
      if (e.TypeID == 32) {
        this.loadStatus = false;
        this.purchaseinvoiceStatus = false;
        this.purchaseorderStatus = false;
        this.saleinvoiceStatus = !this.saleinvoiceStatus;

        this.invoicesaleDocTypeId = null;
        this.invoicesaleDocTypeId = 95;
        this.handleSaleInvoiceApporvalPopupVisibility(1);
      }
      if (e.TypeID == 33) {
        this.loadStatus = false;
        this.purchaseinvoiceStatus = false;
        this.purchaseorderStatus = false;
        this.saleinvoiceStatus = !this.saleinvoiceStatus;

        this.invoicesaleDocTypeId = null;
        this.invoicesaleDocTypeId = 99;
        this.handleSaleInvoiceApporvalPopupVisibility(1);
      }
      if (e.TypeID == 20) {
        this.loadStatus = false;
        this.purchaseinvoiceStatus = false;
        this.saleinvoiceStatus = false;

        this.LoadUnapprovedUPurchaseOrders();
        this.purchaseorderStatus = !this.purchaseorderStatus;
      }

      if (e.TypeID == 37) {
        this.LoadDelivery = false;
        this.purchaseinvoiceStatus = false;
        this.purchaseorderStatus = false;
        this.DeliveryOrderStatus = !this.DeliveryOrderStatus;
        this.getDeliveryOrderRecordForApproved();
      }
      if (e.TypeID == 39) {
        this.GatePassOutwardApprovalPopupVisible = !this.GatePassOutwardApprovalPopupVisible;
        this.PendingGatePassForApproval();
      }
      if (e.TypeID == 40) {
        this.GatePassOutwardGeneralApprovalPopupVisible = !this.GatePassOutwardGeneralApprovalPopupVisible;
        this.PendingGatePassGeneralForApproval();
      }
      if (e.TypeID == 42) {
        this.handleWsrmRequisitionOrderPopupVisibility(1);
      }
      if (e.TypeID == 43) {
        this.handleApprovalPopupVisibility(7);
      }
      if (e.TypeID == 45) {
        this.handleApprovalPopupVisibility(1);
      }
      if (e.TypeID == 47) {
        this.handleApprovalPopupVisibility(6);
      }
      if (e.TypeID == 44) {
        this.handleApprovalPopupVisibility(3);
      }
      if (e.TypeID == 46) {
        this.handleApprovalPopupVisibility(5);
      }
      if (e.TypeID == 48) {
        this.handleSaleReturnTradingApprovalPopupVisibility(1);
      }
      if (e.TypeID == 49) {
        this.handleApprovalPopupVisibility(8);
      }
      if (e.TypeID == 50) {
        this.handleApprovalPopupVisibility(2);
      }
    } else {
      notify("No Record For Approved!", "error");
      return;
    }
  }

  //#region PendingDataForGatePassGeneralApproval
  PendingGatePassGeneralForApproval() {
    this.service
      .GatePassGeneralForUpdateApprovel({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 92,
        FromDate: sessionStorage.getItem("StartPeriod"),
        ToDate: new Date(),
      })
      .subscribe(
        (result) => {
          this.GatePassOutwardGeneraDataPendingForApproval = result;
          this.GatePassOutwardGeneralApprovalPopupGridPageSize = [result.length];
        },
        (error) => {
          console.log(error);
        }
      );
  }
  ApproveGatePassOutwardGeneral(e) {
    this.service
      .ApproveGatePassOutwardGeneral({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 92,
        Id: e.Id,
        EntryUser: sessionStorage.getItem("UserId"),
      })
      .subscribe(
        (result) => {
          this.PendingGatePassGeneralForApproval();
          this.GetInventoryUnApproved();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  closeGatePassOutwardGeneralPopupGrid() {
    this.GatePassOutwardGeneralApprovalPopupVisible = !this.GatePassOutwardGeneralApprovalPopupVisible;
  }
  RptInwardGatePassSlipGeneral_254(e) {
    this.service
      .RptInwardGatePassSlipGeneral_254({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "254-RptInwardGatePassSlipGeneral",
        DocumentTypeId: 92,
        Id: e.Id,
      })
      .subscribe(
        (result) => {
          window.open(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  GatePassOutwardSlipPdfReport(e) {
    this.service
      .GatePassOutwardSlipPdfReport({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "290-InvRptOutwardGatePassSlip",
        DocumentTypeId: 91,
        Id: e.Id,
      })
      .subscribe(
        (result) => {
          window.open(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  //#endregion
  //GetAccountsUnApproved
  async GetAccountsUnApprovedCount() {
    this.dataSource = await this.commonMethods.ReadPendingAccountsApprovals(
      this.CompanyId > 0 ? this.CompanyId : parseInt(sessionStorage.getItem("CompanyId")),
      this.FinancialYearId > 0 ? this.FinancialYearId : this.commonService.FinancialYearId()
    );
    this.FilteredArrayOfAccounts = this.dataSource;
    console.log("Accoutns Data Source: ", this.dataSource);
  }
  //GetInventoryUnApproved
  async GetInventoryUnApproved() {
    this.InventoryTableDataSource = await this.commonMethods.ReadPendingIventoryApprovals(this.CompanyId > 0 ? this.CompanyId : parseInt(sessionStorage.getItem("CompanyId")));
    this.FilteredArrayOfInventory = this.InventoryTableDataSource;
  }
  onToolbarPreparing(event) {
    this.toolbarPreparing(
      event,
      () => this.dataGrid.instance.refresh(),
      () => this.exportGrid(this.dataGrid.instance)
    );
  }

  LoadUnapprovedUPurchaseOrders() {
    this.service
      .purchaseorderhistory({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ApprovedFilter: "Not Approved",
        FromDate: sessionStorage.getItem("StartPeriod"),
        ToDate: new Date(),
        IsApproved: false,
        DocumentTypeId: 41,
      })
      .subscribe(
        (result) => {
          this.unApprovedPurchaseOrderList = result;
          this.purchaseOrderApprovalGridPageSize = [result.length];
        },
        (error) => {
          console.log(error);
        }
      );
  }
  onApprovedPurchaseOrder(e) {
    if (e.IsApproved != "Approved") {
      this.service
        .updatestatusandapproved({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          ReqType: "Approve",
          Id: e.Id,
          EntryUser: sessionStorage.getItem("UserId"),
        })
        .subscribe(
          (result) => {
            notify("Record Approved successfully!", "success");
            this.LoadUnapprovedUPurchaseOrders();
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      notify("Record Already Approved", "error");
    }
  }
  ReportSlip203 = (e) => {
    this.service
      .InvRptPurchaseOrderRiceSlip_203({
        OrderId: e.Id,
        //Compulosry
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        Status: e.Status,
        IsApproved: e.IsApproved,
        ApprovedFilter: e.ApprovedFilter,
        ReportName: "203-InvRptPurchaseOrderRiceSlip",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => {
          notify(error.ExceptionMessage, "error");
        }
      );
  };
  // else
  // {
  //   notify("Record Not Found", "error");
  // }

  // purchaseORderUnapprovedRecord

  PurchaseORderUnApprovedRecord() {
    this.popoverVisible = false;
    this.ApprovalDasboardFormData.OrganizationId = this.commonService.OrganizationId();
    this.ApprovalDasboardFormData.CompanyId = this.commonService.CompanyId();
    this.ApprovalDasboardFormData.FilterType = "Not Approved";
    this.ApprovalDasboardFormData.IsApproved = false;

    this.service.purchaseorderhistory(this.ApprovalDasboardFormData).subscribe(
      (result) => {
        this.purchaseORderDataSource = result;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //PurchaseInvoice
  CustomerAccount() {
    this.service
      .SupplierCustomer({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.supplierList = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  ItemGetAll() {
    this.service
      .ItemGetAll({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.ItemsList = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getPurchaseInvocieUnApprovedRecord() {
    this.purchaseInvoiceDataSource = [];
    this.service
      .PendingInvPurchaseInvoiceForApproval({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        DocumentTypeId: this.invoicepurchaseDocTypeId,
        FromDate: this.ApprovalDasboardFormData.FromDate,
        ToDate: this.ApprovalDasboardFormData.ToDate,
        ItemId: this.ApprovalDasboardFormData.ItemId,
        SupplierCustomerId: this.ApprovalDasboardFormData.SupplierCustomerId,
      })
      .subscribe(
        (result) => {
          this.purchaseInvoiceDataSource = result;
          this.purchaseInvoiceApprovalGridPageSize = [result.length];
        },
        (error) => {
          console.log(error);
        }
      );
  }
  onPurchaseInvoiceApproved(e) {
    if (e.IsApproved != true) {
      this.service
        .InvPurchaseInvoiceandVoucherApproved({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          Id: e.Id,
          DocumentTypeId: this.invoicepurchaseDocTypeId,
          PostDate: new Date(),
          EntryUser: this.commonService.UserId(),
        })
        .subscribe(
          (result) => {
            notify("Record Approved successfully!", "success");
            this.getPurchaseInvocieUnApprovedRecord();
            this.GetInventoryUnApproved();
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      notify("Record Already Approved", "error");
    }
  }
  //SaleInvoic
  getSaleUnApprovedRecord() {
    this.service
      .PendingInvSaleInvoiceForApproval({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        DocumentTypeId: this.invoicesaleDocTypeId,
        FromDate: this.ApprovalDasboardFormData.FromDate,
        ToDate: this.ApprovalDasboardFormData.ToDate,
        ItemId: this.ApprovalDasboardFormData.ItemId,
        SupplierCustomerId: this.ApprovalDasboardFormData.SupplierCustomerId,
      })
      .subscribe(
        (result) => {
          this.saleInvoiceDataSource = [];
          this.saleInvoiceDataSource = result;

          this.saleInvoiceApprovalGridPageSize = [result.length];
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getDeliveryOrderRecordForApproved() {
    this.service
      .GetDeliveryOrderForApproval({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        DocumentTypeId: 84,
        SupplierCustomerId: this.ApprovalDasboardFormData.SupplierCustomerId,
        FromDate: this.ApprovalDasboardFormData.FromDate,
        ToDate: this.ApprovalDasboardFormData.ToDate,
        ItemId: this.ApprovalDasboardFormData.ItemId,
      })
      .subscribe(
        (result) => {
          this.DeliveryOrderList = null;
          this.DeliveryOrderList = result;
          this.DeleiveryOrderApprovalGridPageSize = [result.length];
          this.generateHeaderAndDetailArray();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  generateHeaderAndDetailArray() {
    // this.deliveryOrderApprovalHeaderArray=null;
    this.deliveryOrderApprovalHeaderArray = [];
    if (this.DeliveryOrderList.length > 0) {
      let previousRecord: number = 0;

      for (let i = 0; i < this.DeliveryOrderList.length; i++) {
        let TotalQuantityInOneDelieveryOrder: number = 0;
        let TotalWeightInOneDelieveryOrder: number = 0;
        let TotalSaleOrdersInOneDelieveryOrder: number = 0;
        for (let j = 0; j < this.DeliveryOrderList.length; j++) {
          if (this.DeliveryOrderList[i].DocNo == this.DeliveryOrderList[j].DocNo) {
            TotalQuantityInOneDelieveryOrder += this.DeliveryOrderList[j].DoQty;
            TotalWeightInOneDelieveryOrder += this.DeliveryOrderList[j].DoWeight;
            TotalSaleOrdersInOneDelieveryOrder += 1;
          }
        }
        if (i == 0) {
          this.deliveryOrderApprovalHeaderArray.push({
            Id: this.DeliveryOrderList[i].Id,
            DocDate: this.DeliveryOrderList[i].DocDate,
            DocNo: this.DeliveryOrderList[i].DocNo,
            DeliveryOrderType: this.DeliveryOrderList[i].DeliveryOrderType,
            DoQty: TotalQuantityInOneDelieveryOrder,
            DoWeight: TotalWeightInOneDelieveryOrder,
            TSaleOrders: TotalSaleOrdersInOneDelieveryOrder,
            Remarks: this.DeliveryOrderList[i].LoadingRemarks,
            IsApproved: this.DeliveryOrderList[i].IsApproved,
          });
        } else if (i > 0) {
          if (this.DeliveryOrderList[i].DocNo == previousRecord) {
            continue;
          } else {
            this.deliveryOrderApprovalHeaderArray.push({
              Id: this.DeliveryOrderList[i].Id,
              DocDate: this.DeliveryOrderList[i].DocDate,
              DocNo: this.DeliveryOrderList[i].DocNo,
              DeliveryOrderType: this.DeliveryOrderList[i].DeliveryOrderType,
              DoQty: TotalQuantityInOneDelieveryOrder,
              DoWeight: TotalWeightInOneDelieveryOrder,
              TSaleOrders: TotalSaleOrdersInOneDelieveryOrder,
              Remarks: this.DeliveryOrderList[i].LoadingRemarks,
              IsApproved: this.DeliveryOrderList[i].IsApproved,
            });
          }
        }
        previousRecord = this.DeliveryOrderList[i].DocNo;
      }
    }
  }
  // getDOConfirmationForApprovel=(e)=>
  // {
  //   this.deleiveryOrderApprovalConfirmationVisisble = !this.deleiveryOrderApprovalConfirmationVisisble;
  //   this.ApprovalRowData = e;
  // }

  ApprovedRecordByDeliveryOrderId(e) {
    if (e.IsApproved != true) {
      this.service
        .ApprovedRecordByDeliveryOrderId({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          Id: e.Id,
          ReqType: "Approve",
          EntryUser: this.commonService.UserId(),
          DocumentTypeId: 84,
        })
        .subscribe(
          (result) => {
            notify("Record Approved successfully!", "success");
            this.getDeliveryOrderRecordForApproved();
            this.GetInventoryUnApproved();
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      notify("Record Already Approved", "error");
    }
  }

  DeliveryOrderSlip_262(e) {
    // this.service
    //   .DeliveryOrderSlip_262({
    //     DocumentTypeId: 84,
    //     Id: e.Id,
    //     OrganizationId: this.commonService.OrganizationId(),
    //     CompanyId: this.commonService.CompanyId(),
    //     CompanyAddress: sessionStorage.getItem("CompanyAddress"),
    //     CompanyName: sessionStorage.getItem("CompanyName"),
    //     ReportName: "220-InvRptPurchaseBillSupplierRiceSlip",
    //   })
    //   .subscribe(
    //     (result) => window.open(result),
    //     (error) => console.log(error)
    //   );
  }

  onSaleInvoiceApproved(e) {
    if (e.IsApproved != true) {
      this.service
        .InvSaleInvoiceandVoucherApproved({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          Id: e.Id,
          DocumentTypeId: this.invoicesaleDocTypeId,
          PostDate: new Date(),
          EntryUser: this.commonService.UserId(),
        })
        .subscribe(
          (result) => {
            notify("Record Approved successfully!", "success");
            this.getSaleUnApprovedRecord();
            this.GetInventoryUnApproved();
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      notify("Record Already Approved", "error");
    }
  }

  GetUnApprovedSaleOrders() {
    this.service
      .saleorderhistory({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocId: 81,
        FilterType: "Not Approved",
        IsApproved: false,
        DocumentTypeId: 81,
      })
      .subscribe(
        (result) => {
          this.UnApprovedSaleOrderList = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onPurchasInvoiceVoucherpdfReportPrint(e) {
    if (this.invoicepurchaseDocTypeId == 56) {
      this.PurchaseInvoiceVoucher103(e);
    }
    if (this.invoicepurchaseDocTypeId == 57) {
      this.PurchaseInvoiceVoucher103(e);
    }
    if (this.invoicesaleDocTypeId == 95) {
      this.saleInvoiceVoucher103(e);
    }
    if (this.invoicesaleDocTypeId == 99) {
      this.saleInvoiceVoucher103(e);
    }
  }

  onPurchasInvoicepdfReportPrint(e) {
    if (this.invoicepurchaseDocTypeId == 56) {
      this.purchaseInoviceSlip(e);
    }
    if (this.invoicepurchaseDocTypeId == 57) {
      this.purchaseInoviceDirectSlip(e);
    }
  }
  purchaseInoviceSlip(e) {
    this.service
      .InvPurchaseInvoiceSlipReport220({
        DocumentTypeId: 56,
        Id: e.Id,
        PihId: e.Id,
        //Compulosry
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        FromDate: null,
        ToDate: null,
        FromDocNo: null,
        ToDocNo: null,
        SupplierCustomerId: null,
        BranchesId: null,
        ReportName: "220-InvRptPurchaseBillSupplierRiceSlip",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => console.log(error)
      );
  }
  purchaseInoviceDirectSlip(e) {
    this.service
      .InvRepPurchaseBillDirectWithoutPo_225({
        DocumentTypeId: 57,
        Id: e.Id,
        HeaderId: e.Id,
        //Compulosry
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        FromDate: null,
        ToDate: null,
        FromDocNo: null,
        ToDocNo: null,
        SupplierCustomerId: null,
        BranchesId: null,
        ReportName: "225-InvRepPurchaseBillDirectWithoutPo",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => console.log(error)
      );
  }
  PurchaseInvoiceVoucher103(e) {
    this.service
      .getPurhcaseInvoiceVoucherpdfReport({
        Id: e.VoucherHeadId,
        //Compulosry
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        DocumentTypeId: this.invoicepurchaseDocTypeId,
        ReportName: "103-AcRptPurchaseSalesVoucherSlip",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => console.log(error)
      );
  }
  //SaleINvoicePrintg
  onSaleInvoicepdfReportPrint(e) {
    if (this.invoicesaleDocTypeId == 95) {
      this.saleInoviceSlip(e);
    }
    if (this.invoicepurchaseDocTypeId == 99) {
      this.InvRptSaleBillDirectWithoutSO(e);
    }
  }
  saleInoviceSlip(e) {
    this.service
      .InvSaleInvoiceCustomerBillReport301({
        DocumentTypeId: 95,
        Id: e.Id,
        HeaderId: e.Id,
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        FromDate: null,
        ToDate: null,
        FromDocNo: null,
        ToDocNo: null,
        SupplierCustomerId: null,
        BranchesId: null,
        ReportName: "301-InvRepSaleBillCustomer",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => console.log(error)
      );
  }
  InvRptSaleBillDirectWithoutSO(e) {
    this.service
      .InvRptSaleBillDirectWithoutSO_294({
        DocumentTypeId: 99,
        Id: e.Id,
        HeaderId: e.Id,
        //Compulosry
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        FromDate: null,
        ToDate: null,
        FromDocNo: null,
        ToDocNo: null,
        SupplierCustomerId: null,
        BranchesId: null,
        ReportName: "301-InvRepSaleBillCustomer",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => console.log(error)
      );
  }
  saleInvoiceVoucher103(e) {
    this.service
      .getPurhcaseInvoiceVoucherpdfReport({
        Id: e.VoucherHeadId,
        //Compulosry
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        DocumentTypeId: this.invoicesaleDocTypeId,
        ApprovedFilter: "All",
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),

        ReportName: "103-AcRptPurchaseSalesVoucherSlip",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => console.log(error)
      );
  }
  SaleOrderSlip_272 = (e) => {
    this.service
      .SaleOrderSlip_272({
        //Compulosry
        Id: e.Id,
        DocumentTypeId: 81,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ApprovedFilter: "Not Approved",
        IsApproved: false,
        ReportName: "272-InvRptSaleOrderSlipWithDespatchDetail",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => {
          notify(error.ExceptionMessage, "error");
        }
      );
  };

  //=============================================14 April Usman Farooq
  FilteredArrayOfAccounts = [];
  FilteredArrayOfInventory = [];

  accountsSearch(event) {
    if (event.target.value) {
      let searchValue = event.target.value.toLowerCase();
      this.FilteredArrayOfAccounts = [];
      for (let i = 0; i < this.dataSource.length; i++) {
        let lowerCaseDataSourceValue = this.dataSource[i].VoucherType.toLowerCase();
        if (lowerCaseDataSourceValue.includes(searchValue)) {
          this.FilteredArrayOfAccounts.push(this.dataSource[i]);
        }
      }
    } else {
      this.FilteredArrayOfAccounts = this.dataSource;
    }
  }

  InventorySearch(event) {
    if (event.target.value) {
      let searchValue = event.target.value.toLowerCase();
      this.FilteredArrayOfInventory = [];
      for (let i = 0; i < this.InventoryTableDataSource.length; i++) {
        let lowerCaseDataSourceValue = this.InventoryTableDataSource[i].Description.toLowerCase();
        if (lowerCaseDataSourceValue.includes(searchValue)) {
          this.FilteredArrayOfInventory.push(this.InventoryTableDataSource[i]);
        }
      }
    } else {
      this.FilteredArrayOfInventory = this.InventoryTableDataSource;
    }
  }
}
///////////////// delete //////////////////////////////
// deleteById() {
//   this.service.StateProvinceDelById(this.deleteIdValue).subscribe(
//     (result) => {
//       this.notification("Record deleted successfully", "error");
//       this.StateProvinceGetAll();
//       this.confirmPopup = false;
//     },
//     (error) => console.log(error)
//   );
// }

// showConfirmation(e) {
//   this.confirmPopup = true;
//   this.deleteIdValue = e.Id;
// }

// cancelDelete() {
//   this.confirmPopup = false;
// }
/////////////////////////////////////////////////////////////////
/////////////////////edit////////////////////////////////////////
