import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApprovalDashboardService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  params = new HttpParams();

  constructor(private http: HttpClient) {}

  ReadDashboard(data) {
    return this.http.post<any>(this.apiUrl + "Dashboard/AccountsPendingApprovals", data, {
      headers: this.headers,
    });
  }

  ReadInventoryDashboard(data) {
    return this.http.post<any>(this.apiUrl + "Dashboard/InventoryPendingApprovals", data, {
      headers: this.headers,
    });
  }

  getVoucherHistoryList(data) {
    return this.http.post<any>(this.apiUrl + "Voucher/VoucherForApprovalDashboard", data, {
      headers: this.headers,
    });
  }

  // VoucherPdfReport
  VoucherReport(data) {
    return this.http.post<any>(this.apiUrl + "AccountsPdfReports/PaymentVoucherSlipPdfReprot", data, {
      headers: this.headers,
    });
  }
  getPaymentVoucherPdfReportSlip102(data) {
    return this.http.post<any>(this.apiUrl + "AccountsPdfReports/AccountsVoucherSlip102", data, {
      headers: this.headers,
    });
  }
  approvedVouchersbyId(data) {
    return this.http.post<any>(this.apiUrl + "PurchaseOrder/UpdateStatusandIsapprovedByVoucherId", data, {
      headers: this.headers,
    });
  }

  //InventoryMethod
  SupplierCustomer(data) {
    return this.http.post<any>(this.apiUrl + "SupplierCustomer/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  ItemGetAll(data) {
    return this.http.post<any>(this.apiUrl + "Item/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  PendingInvPurchaseInvoiceForApproval(data) {
    return this.http.post<any>(this.apiUrl + "InvPurchaseInvoice/PendingInvPurchaseInvoiceForApproval", data, {
      headers: this.headers,
    });
  }
  InvPurchaseInvoiceandVoucherApproved(data) {
    return this.http.post<any>(this.apiUrl + "InvPurchaseInvoice/InvPurchaseInvoiceandVoucherApprove", data, {
      headers: this.headers,
    });
  }
  updatestatusandapproved(data) {
    return this.http.post<any>(this.apiUrl + "PurchaseOrder/UpdateStatusandIsApprovedbyOrderId", data, {
      headers: this.headers,
    });
  }

  //Sale
  PendingInvSaleInvoiceForApproval(data) {
    return this.http.post<any>(this.apiUrl + "InvSaleInvoice/PendingInvSaleInvoiceForApproval", data, {
      headers: this.headers,
    });
  }
  InvRptPurchaseOrderRiceSlip_203(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvRptPurchaseOrderRiceSlip_203", data, {
      headers: this.headers,
    });
  }

  GetDeliveryOrderForApproval(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/GetDeliveryOrderForApproval", data, {
      headers: this.headers,
    });
  }

  ApprovedRecordByDeliveryOrderId(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/ApprovedRecordByDeliveryOrderId", data, {
      headers: this.headers,
    });
  }

  DeliveryOrderSlip_262(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/DeliveryOrderSlip_262", data, {
      headers: this.headers,
    });
  }
  InvSaleInvoiceandVoucherApproved(data) {
    return this.http.post<any>(this.apiUrl + "InvSaleInvoice/InvSaleInvoiceandVoucherApprove", data, {
      headers: this.headers,
    });
  }
  // PurcahseORders
  purchaseorderhistory(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/PurchaseOrderHistory", data, {
      headers: this.headers,
    });
  }
  //PurcahseInvoicePdfReport
  InvPurchaseInvoiceSlipReport220(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/InvPurchaseInvoiceSlipReport202", data, {
      headers: this.headers,
    });
  }
  InvRepPurchaseBillDirectWithoutPo_225(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/InvRepPurchaseBillDirectWithoutPo_225", data, {
      headers: this.headers,
    });
  }
  getPurhcaseInvoiceVoucherpdfReport(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/PurhcaseInvoiceVoucherPdfReport", data, {
      headers: this.headers,
    });
  }
  //saleInvoice
  InvSaleInvoiceCustomerBillReport301(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/InvSaleInvoiceCustomerBillReport301", data, {
      headers: this.headers,
    });
  }
  InvRptSaleBillDirectWithoutSO_294(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/InvRptSaleBillDirectWithoutSO_294", data, {
      headers: this.headers,
    });
  }

  GatePassOutwardSlipPdfReport(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/GatePassOutwardSlipPdfReport", data, {
      headers: this.headers,
    });
  }

  RptInwardGatePassSlipGeneral_254(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/RptInwardGatePassSlipGeneral_254", data, {
      headers: this.headers,
    });
  }

  //#region ServiceForPendingGatePassOutward
  PendingGatePassForApproval(data) {
    return this.http.post<any>(this.apiUrl + "GatePassOutward/PendingGatePassForApproval", data, {
      headers: this.headers,
    });
  }

  ApproveGatePassOutward(data) {
    return this.http.post<any>(this.apiUrl + "GatePassOutward/ApproveGatePassOutward", data, {
      headers: this.headers,
    });
  }

  //#endregion

  //#region GP Outward General

  GatePassGeneralForUpdateApprovel(data) {
    return this.http.post<any>(this.apiUrl + "GatePassOutward/GatePassGeneralForUpdateApprovel", data, {
      headers: this.headers,
    });
  }

  ApproveGatePassOutwardGeneral(data) {
    return this.http.post<any>(this.apiUrl + "GatePassOutward/ApproveGeneralGatePassOutward", data, {
      headers: this.headers,
    });
  }
  UnApprovedSupplyOrderForDashboard(data) {
    return this.http.post<any>(this.apiUrl + "InvSupplyOrder/UnApprovedSupplyOrderForDashboard", data, {
      headers: this.headers,
    });
  }

  getPurchaseSupplyOrderPdfReportSlip330(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/InvSupplyOrderSlip330", data, {
      headers: this.headers,
    });
  }
  ApproveSupplyOrderAgainstSelectedId(data) {
    return this.http.post<any>(this.apiUrl + "InvSupplyOrder/ApproveSupplyOrderAgainstSelectedId", data, {
      headers: this.headers,
    });
  }

  getSupplyOrderById(id) {
    return this.http.get<any>(this.apiUrl + "InvSupplyOrder/GetByID", {
      params: this.params.set("Id", id),
    });
  }
  saleorderhistory(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/SaleOrderHistory", data, {
      headers: this.headers,
    });
  }
  AppoveSaleOrder(data) {
    return this.http.post<any>(this.apiUrl + "SaleOrder/UpdateStatusandIsApprovedbyOrderId", data, {
      headers: this.headers,
    });
  }
  SaleOrderSlip_272(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvRptSaleOrderSlipWithDespatchDetail_272", data, {
      headers: this.headers,
    });
  }
  //============================================================10 Jan 2022
  GetUnApprovedRequisitionOrderList(data) {
    return this.http.post<any>(this.apiUrl + "WsRmRequisitionPo/GetUnApprovedRequisitionOrders", data, {
      headers: this.headers,
    });
  }
  ApproveRequisitionOrder(data) {
    return this.http.post<any>(this.apiUrl + "WsRmRequisitionPo/RequisitionApproval", data, {
      headers: this.headers,
    });
  }
  GetRequisitionOrderById(id) {
    let params = new HttpParams().set("Id", id);
    return this.http.get(this.apiUrl + "WsRmRequisitionPo/GetByID", {
      headers: this.headers,
      params: params,
    });
  }
  GetUnApprovedImportInvoices(data) {
    return this.http.post<any>(this.apiUrl + "ImportReports/ImInvoiceSlip_806", data, {
      headers: this.headers,
    });
  }
  ApproveImportInvoice(data) {
    return this.http.post<any>(this.apiUrl + "ImInvoice/ApproveImportInvoice", data, {
      headers: this.headers,
    });
  }
  ImInvoiceSlip_806(data) {
    return this.http.post<any>(this.apiUrl + "ImportPdfReports/ImInvoiceSlip_806", data, {
      headers: this.headers,
    });
  }
  GetUnApprovedWsrmSaleInvoices(data) {
    return this.http.post<any>(this.apiUrl + "PosReports/WsrmSalesInvoiceSlipAndRegister", data, {
      headers: this.headers,
    });
  }
  ApproveWsrmSaleInvoice(data) {
    return this.http.post<any>(this.apiUrl + "WsRmSaleInvoice/ApproveWsRmSaleInvoice", data, {
      headers: this.headers,
    });
  }
  WsrmSalesInvoiceSlip_700(data) {
    return this.http.post<any>(this.apiUrl + "posPdfReports/WsrmSalesInvoiceSlip_700", data, {
      headers: this.headers,
    });
  }
  GetUnApprovedImportPurchaseOrders(data) {
    return this.http.post<any>(this.apiUrl + "ImportReports/ImPuchaseOrderSlipAndRegister_805", data, {
      headers: this.headers,
    });
  }
  ApporveImportPurchaseOrder(data) {
    return this.http.post<any>(this.apiUrl + "ExImLcOrderPurchaseOrder/ApporveImportPurchaseOrder", data, {
      headers: this.headers,
    });
  }
  WsrmSalesOrderSlipAndRegister(data) {
    return this.http.post<any>(this.apiUrl + "PosReports/WsrmSalesOrderSlipAndRegister", data, {
      headers: this.headers,
    });
  }

  ApproveWsrmSaleOrder(data) {
    return this.http.post<any>(this.apiUrl + "WsRmSalesOrder/ApproveWsrmSaleOrder", data, {
      headers: this.headers,
    });
  }
  ApporveImportContract(data) {
    return this.http.post<any>(this.apiUrl + "ImLcOrder/ApporveImportContract", data, {
      headers: this.headers,
    });
  }
  ImportContractSlipAndRegister(data) {
    return this.http.post<any>(this.apiUrl + "ImportReports/ImportContractSlipAndRegister", data, {
      headers: this.headers,
    });
  }
  GetSaleInvoiceReturnForApproval(data) {
    return this.http.post<any>(this.apiUrl + "InvSaleInvoice/GetSaleInvoiceReturnForApproval", data, {
      headers: this.headers,
    });
  }
  InvPurchaseInvoiceandVoucherApprove(data) {
    return this.http.post<any>(this.apiUrl + "InvPurchaseInvoice/InvPurchaseInvoiceandVoucherApprove", data, {
      headers: this.headers,
    });
  }
  GetPurchaseInvoiceReturnForApproval(data) {
    return this.http.post<any>(this.apiUrl + "InvPurchaseInvoice/GetPurchaseInvoiceReturnForApproval", data, {
      headers: this.headers,
    });
  }
  InvSaleInvoiceandVoucherApprove(data) {
    return this.http.post<any>(this.apiUrl + "InvSaleInvoice/InvSaleInvoiceandVoucherApprove", data, {
      headers: this.headers,
    });
  }
  //#endregion
  //==============================================================

  PurchaseOrderTradingApprove(data) {
    return this.http.post<any>(this.apiUrl + "PurchaseOrder/PurchaseOrderTradingApprove", data, {
      headers: this.headers,
    });
  }


  PurchaseInvoiceTradingApprove(data) {
    return this.http.post<any>(this.apiUrl + "InvPurchaseInvoice/InvPurchaseInvoiceandVoucherApprove", data, {
      headers: this.headers,
    });
  }

  PurchaseInvoiceTradingForApproval(data) {
    return this.http.post<any>(this.apiUrl + "InvPurchaseInvoice/PendingInvPurchaseInvoiceForApproval", data, {
      headers: this.headers,
    });
  }
  PurchaseOrderTrading_276(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/PurchaseOrderTrading_276", data, {
      headers: this.headers,
    });
  }
  PurchaseInvoiceReturn_279(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/PurchaseInvoiceReturn_279", data, {
      headers: this.headers,
    });
  }
  PurchaseInvoiceTrading_230(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/RptPurchaseInvoiceSlip_230", data, {
      headers: this.headers,
    });
  }
  WsrmSalesOrderSlip_701(data) {
    return this.http.post<any>(this.apiUrl + "posPdfReports/WsrmSalesOrderSlip_701", data, {
      headers: this.headers,
    });
  }
  ImpContractSlip_801(data) {
    return this.http.post<any>(this.apiUrl + "ImportPdfReports/ImpContractSlip_801", data, {
      headers: this.headers,
    });
  }
  PurchaseOrderSlipB_805(data) {
    return this.http.post<any>(this.apiUrl + "ImportPdfReports/PurchaseOrderSlipB_805", data, {
      headers: this.headers,
    });
  }
}
