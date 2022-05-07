import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { fadeInLeftOnEnterAnimation } from "angular-animations";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { PurchaseInvoiceDetailModel, PurchaseInvoiceModel } from "../purchase-invoice.model";
import { PurchaseInvoiceService } from "../purchase-invoice.service";

@Component({
  selector: "purchase-invoice-loader",
  templateUrl: "./purchase-invoice-loader.component.html",
  styleUrls: ["./purchase-invoice-loader.component.scss"],
})
export class PurchaseInvoiceLoaderComponent extends BaseActions implements OnInit {
  @ViewChild("purchaseInvoiceLoader", { static: false })
  purchaseInvoiceLoader: DxDataGridComponent;
  loaderDataSource = [];
  loaderHeaderArray = [];
  dataAgainstGrnIdsToLoad: PurchaseInvoiceModel;

  @Output() closeLoaderPopup = new EventEmitter();
  @Output() getSelectedData = new EventEmitter();
  @Input() visibility: boolean;

  constructor(private service: PurchaseInvoiceService) {
    super();
  }

  ngOnInit(): void {
    this.dataAgainstGrnIdsToLoad = new PurchaseInvoiceModel();
    this.getPendingGrnForPurchaseInvoiceInLoaderAgainstSupplierId();
  }

  getPendingGrnForPurchaseInvoiceInLoaderAgainstSupplierId() {
    this.service
      .getPendingGrnsForPurchaseInoive({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 46,
      })
      .subscribe(
        (resp) => {
          this.loaderDataSource = resp;
          this.loaderHeaderArray = this.GenerateHeaderData(resp, "Id");
        },
        (error) => this.HandleError(error)
      );
  }

  exportSelectedRecord() {
    let SelectedData = this.purchaseInvoiceLoader.instance.getSelectedRowsData();
    if (SelectedData?.length > 0 == false) {
      this.WarningPopup("Please Select GRN First!");
    } else {
      let previousSupplierId = SelectedData[0].SupplierCustomerId;
      for (let i = 1; i < SelectedData.length; i++) {
        if (SelectedData[i].SupplierCustomerId != previousSupplierId) {
          this.WarningPopup("Please Select GRNs of 1 Customer because Purchase Invoice can be made against 1 Customer Only!");
          return;
        }
        previousSupplierId = SelectedData[i].SupplierCustomerId;
      }
      let IdsOfGrn = "";
      for (let item of SelectedData) {
        IdsOfGrn = IdsOfGrn + "," + item.Id;
      }
      this.gettingGrnDataAgainstGrnIds(IdsOfGrn);
    }
  }

  async gettingGrnDataAgainstGrnIds(grnIds) {
    console.log("Grn Ids", grnIds);
    //#region Detail
    let detailResp = await this.DetailDataByGrnIds(grnIds);
    this.dataAgainstGrnIdsToLoad.SupplierCustomerId = detailResp[0]?.SupplierCustomerId;
    this.dataAgainstGrnIdsToLoad.CommissionAgentId = detailResp[0]?.CommissionAgentId;
    this.dataAgainstGrnIdsToLoad.CommissionType = detailResp[0]?.CommissionType;
    this.dataAgainstGrnIdsToLoad.CommRate = detailResp[0]?.CommRate;
    this.dataAgainstGrnIdsToLoad.UomScheduleIdCmRate = detailResp[0]?.UomScheduleIdCmRate;
    this.dataAgainstGrnIdsToLoad.CommAmount = detailResp[0]?.CommAmount;
    this.dataAgainstGrnIdsToLoad.CommissionRemarks = detailResp[0]?.CommissionRemarks;
    this.dataAgainstGrnIdsToLoad.BrokerAgentId = detailResp[0]?.BrokerAgentSupCustId;
    this.dataAgainstGrnIdsToLoad.BrokeryAmount = detailResp[0]?.BrokeryAmount;
    this.dataAgainstGrnIdsToLoad.BrokeryRate = detailResp[0]?.BrokeryRate;
    this.dataAgainstGrnIdsToLoad.BrokeryType = detailResp[0]?.BrokeryType;
    this.dataAgainstGrnIdsToLoad.BrokeryUom = detailResp[0]?.BrokeryUom;
    this.dataAgainstGrnIdsToLoad.DeliveryTerm = detailResp[0]?.DeliveryTerm;
    this.dataAgainstGrnIdsToLoad.DueDays = detailResp[0]?.OrderDueDays;
    this.dataAgainstGrnIdsToLoad.DueDate = detailResp[0]?.OrderDueDate;
    this.dataAgainstGrnIdsToLoad.RemarksHeader = detailResp[0]?.RemarksHeader;
    let detailData = [];
    detailResp?.map((item) => {
      detailData.push({
        ItemId: item?.ItemId,
        ItemName: item?.ItemName,
        CropYear: item?.CropYear,
        UOMCodeItem: item.UOMCodeItem,
        ItemQty: item.ItemQty,
        LabAnalisysNo: item.LabAnalisysNo,
        PurchaseOrder: item.PurchaseOrder,
        EBTotalWt: item.EBTotalWt,
        WeightCutTotal: item.WeightCutTotal,
        NetBillWeight: item.NetBillWeight,
        GrossWeight: item.GrossWeight,
        NetStockWeight: item.NetStockWeight,
        ItemRate: item.ItemRate,
        UomScheduleIdRate: item.UomScheduleIdRate,
        EquivalentPoRate: item.EquivalentPoRate,
        ItemAmount: item.ItemAmount,
        BillAmount: 0,
        CarriageAmount: 0,
        ExpenseAmount: 0,
        CommissionAmount: 0,
        // GpDate:item.
        AdLsWeight: item.AdLsWeight,
        WeightCut: item.WtCut,
        GpNo: item.GpNo,
        InvGrnDetailId: item.InvGrnDetailId,
        InvGrnId: item.InvGrnId,
        JobLotId: item.JobLotId,
        PackingTypeId: item.PackingTypeId,
        PurchaseOrderId: item.PurchaseOrderId,
        WarehouseId: item.WarehouseId,
        VehicleNo: item.VehicleNo,
        PurchaseGLAC: item.PurchaseGLAC,
        ItemCode: item.ItemCode,
      });
    });
    this.dataAgainstGrnIdsToLoad.invPurchaseInvoiceDetailList = detailData;
    //#endregion

    //#region Freihgt
    let freightData = await this.GetTransporterAndFreight(grnIds);
    let FreightsDataList = [];
    freightData?.map((item) => {
      FreightsDataList.push({
        InvPurchaseInvoiceId: null,
        Id: null,
        FrRate: null,
        FrWeight: null,
        FrQty: null,
        FreightAmount: item.CarriageAmount,
        Debit: 0,
        Percentage: null,
        InvGrnId: item.MainId,
        TansporterId: item.Transporter,
        PurchaseOrderId: null,
        Remarks: "",
        AccountTitle: item.AccountTitle,
      });
    });
    this.dataAgainstGrnIdsToLoad.InvPurchaseInvoiceFreightList = FreightsDataList;
    console.log("Fright data: ", this.dataAgainstGrnIdsToLoad.InvPurchaseInvoiceFreightList);
    //#endregion

    //#region empty
    let EmptyBagsData = await this.GetEmptyBagsByGrnIds(grnIds);
    let emptyBagsDataList = [];
    EmptyBagsData?.map((item) => {
      emptyBagsDataList.push({
        InvGrnId: item.InvGrnId,
        ItemId: item.ItemId,
        ItemName: item.ItemName,
        PurchaseQty: item.PurchaseQty,
        Rate: item.Rate,
        Amount: 0,
        Remarks: item.Remarks,
        ReceivedQty: 0,
        Id: null,
        InvPurchaseInvoiceId: null,
        TypeId: item.TypeId,
      });
    });
    this.dataAgainstGrnIdsToLoad.InvPurchaseInvoiceEmptyBagslist = emptyBagsDataList;
    console.log("Empty Bags Data:", this.dataAgainstGrnIdsToLoad.InvPurchaseInvoiceEmptyBagslist);
    //#endregion

    //#region expense
    let expensData = await this.GetExpenseGridDataByGrnIds(grnIds);
    let expenseDataList = [];
    expensData?.map((item) => {
      if (item.BagPrice > 0) {
        expenseDataList.push({
          InvRevExpItemId: null,
          Id: null,
          InvPurchaseInvoiceId: null,
          Qty: item.ItemQty,
          Rate: item.BagPrice,
          Amount: item.ItemQty * item.BagPrice,
          Remarks: "",
        });
      }
    });
    this.dataAgainstGrnIdsToLoad.InvPurchaseInvoiceExpList = expenseDataList;
    console.log("expense data: ", this.dataAgainstGrnIdsToLoad.InvPurchaseInvoiceExpList);
    //#endregion

    console.log(this.dataAgainstGrnIdsToLoad);
    this.getSelectedData.emit(this.dataAgainstGrnIdsToLoad);
  }

  async DetailDataByGrnIds(grnIds) {
    return await this.service.getGrnOnBillDetailLoad(grnIds).catch((err) => this.HandleError(err));
  }

  async GetTransporterAndFreight(grnIds) {
    return await this.service.GetTransporterAndFreight(grnIds).catch((err) => this.HandleError(err));
  }

  async GetEmptyBagsByGrnIds(grnIds) {
    return await this.service.GetEmptyBagsByGrn(grnIds).catch((error) => this.HandleError(error));
  }

  async GetExpenseGridDataByGrnIds(grnIds) {
    return await this.service.GetExpenseGridDataByGrnIds(grnIds).catch((error) => this.HandleError(error));
  }

  closingLoaderPopup() {
    this.closeLoaderPopup.emit("1");
  }

  DummyMethod() {}
  onToolbarPreparing = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("purchaseInvoiceLoader"), this.purchaseInvoiceLoader));
    this.FilterButtonInGridToolbar(e);
  };
}
