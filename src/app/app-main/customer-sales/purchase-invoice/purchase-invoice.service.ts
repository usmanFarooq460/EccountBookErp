import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PurchaseInvoiceService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
  });
  constructor(private http: HttpClient) {}
  params = new HttpParams();

  getDocumentNo(data) {
    return this.http
      .post<any>(this.apiUrl + "InvPurchaseInvoice/GenerateInvPurchaseInvoiceCode", data, {
        headers: this.headers,
      })
      .toPromise();
  }

  GetTransporterAndFreight(id) {
    return this.http
      .get<any>(this.apiUrl + "InvPurchaseInvoice/GetTransporterAndFreightFromGrn", {
        params: this.params.set("Id", id),
        headers: this.headers,
      })
      .toPromise();
  }

  GetEmptyBagsByGrn(id) {
    return this.http
      .get<any>(this.apiUrl + "InvPurchaseInvoice/GetEmptyBagsFromGrn", {
        params: this.params.set("Id", id),
      })
      .toPromise();
  }

  getPendingGrnsForPurchaseInoive(data) {
    return this.http.post<any>(this.apiUrl + "InvPurchaseInvoice/PendingGrnforLoadingInvoice", data);
  }

  getGrnOnBillDetailLoad(id) {
    let params = new HttpParams().set("Id", id);
    return this.http
      .get<any>(this.apiUrl + "InvPurchaseInvoice/GrnLoadForPurchaseInvoice", {
        headers: this.headers,
        params: params,
      })
      .toPromise();
  }
  getTaxPercent(data) {
    return this.http.post<any>(this.apiUrl + "ItemTaxSchedule/GetTaxSchedulebyItemId", data);
  }

  GetExpenseGridDataByGrnIds(id) {
    return this.http
      .get<any>(this.apiUrl + "InvPurchaseInvoice/GetItemQtyAndItemRateFromPO", {
        params: this.params.set("Id", id),
      })
      .toPromise();
  }

  getPurchaseBillList(data) {
    return this.http.post<any>(this.apiUrl + "InvPurchaseInvoice/FormHistory", data);
  }

  getPurchaseBillById(id) {
    let params = new HttpParams().set("Id", id);
    return this.http.get<any>(this.apiUrl + "InvPurchaseInvoice/GetByID", { params: params });
  }

  savePurchaseBill(data) {
    return this.http.post<any>(this.apiUrl + "InvPurchaseInvoice/Save", data);
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
