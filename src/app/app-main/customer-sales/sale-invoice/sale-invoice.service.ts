import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SaleInvoiceService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
  });
  constructor(private http: HttpClient) {}
  params = new HttpParams();

  getDocumentNo(data) {
    return this.http.post<any>(this.apiUrl + "InvPurchaseInvoice/GenerateInvPurchaseInvoiceCode", data);
  }


  GetTransporterAndFreight(id) {
    return this.http.get<any>(this.apiUrl + "InvSaleInvoice/GetTransporterAndFreightFromGdn", {
      params: this.params.set("Id", id),
    });
  }

  GetEmptyBagsByGrn(id) {
    return this.http.get<any>(this.apiUrl + "InvPurchaseInvoice/GetEmptyBagsFromGrn", {
      params: this.params.set("Id", id),
    });
  }
  GetExpenseGridDataByGdnIds(id) {
    return this.http.get<any>(this.apiUrl + "InvSaleInvoice/GetItemQtyAndItemRateFromSO", {
      params: this.params.set("Id", id),
    });
  }

  getPendingGdnsForSaleInoive(data) {
    return this.http.post<any>(this.apiUrl + "InvSaleInvoice/PendingGdnforLoadingInvoiceRice", data);
  }

  getGdnDataOnSelection(id) {
    let params = new HttpParams().set("Id", id);
    return this.http.get<any>(this.apiUrl + "InvSaleInvoice/GdnLoadForSaleInvoice", { params: params });
  }
  getTaxPercent(data) {
    return this.http.post<any>(this.apiUrl + "ItemTaxSchedule/GetTaxSchedulebyItemId", data);
  }


  getSaleInvoiceList(data) {
    return this.http.post<any>(this.apiUrl + "InvSaleInvoice/FormHistory", data);
  }

  getSaleInvoiceById(id) {
    let params = new HttpParams().set("Id", id);
    return this.http.get<any>(this.apiUrl + "InvSaleInvoice/GetByID", { params: params });
  }

  saveSave(data) {
    return this.http.post<any>(this.apiUrl + "InvSaleInvoice/Save", data);
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
}
