import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PurchaseInvoiceDirectService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
  });
  constructor(private http: HttpClient) {}
  params = new HttpParams();

  getDocumentNo(data) {
    return this.http.post<any>(this.apiUrl + "InvSaleInvoice/GenerateInvSaleInvoiceCode", data);
  }

  GetEmptyBagsByGrn(id) {
    return this.http.get<any>(this.apiUrl + "InvPurchaseInvoice/GetEmptyBagsFromGrn", {
      params: this.params.set("Id", id),
    });
  }

  getUOM(data) {
    return this.http.post<any>(this.apiUrl + "UOMSchedule/SearchByObject", data);
  }

  getTaxPercent(data) {
    return this.http.post<any>(this.apiUrl + "ItemTaxSchedule/GetTaxSchedulebyItemId", data);
  }

  GetExpenseGridDataByGrnIds(id) {
    return this.http.get<any>(this.apiUrl + "InvPurchaseInvoice/GetItemQtyAndItemRateFromPO", {
      params: this.params.set("Id", id),
    });
  }

  getSaleBillList(data) {
    return this.http.post<any>(this.apiUrl + "InvSaleInvoice/FormHistory", data, {
      headers: this.headers,
    });
  }

  getSaleInvoiceById(id) {
    let params = new HttpParams().set("Id", id);
    return this.http.get<any>(this.apiUrl + "InvSaleInvoice/GetByID", { params: params });
  }

  save(data) {
    return this.http.post<any>(this.apiUrl + "InvSaleInvoice/Save", data, { headers: this.headers });
  }
  getpdfReport(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/InvPurchaseInvoiceSlipReport202", data, {
      headers: this.headers,
    });
  }
  getVoucherpdfReport(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/PurhcaseInvoiceVoucherPdfReport", data, {
      headers: this.headers,
    });
  }
  getvoucherheadId(data) {
    return this.http.post<any>(this.apiUrl + "Voucher/GetVoucherHeadIdByDocumentTypeIdandRefDocNoId", data, {
      headers: this.headers,
    });
  }

  GetSaleOrderNumbersByCustomerId(data) {
    return this.http.post<any>(this.apiUrl + "SaleOrder/GetSaleOrderNo", data, {
      headers: this.headers,
    });
  }
  GetSaleOrderDataByIdandOrganizationIdandCompanyIdinSaleOrderLoader(data) {
    return this.http.post<any>(this.apiUrl + "SaleOrder/GetOrderDetailRecordByOrderId", data, {
      headers: this.headers,
    });
  }

  GetAvailableTransactionsForIssuance(data) {
    return this.http.post<any>(this.apiUrl + "InventoryStockEvalautionDetail/GetAvailableTransactionsForIssuance", data, {
      headers: this.headers,
    });
  }
}
