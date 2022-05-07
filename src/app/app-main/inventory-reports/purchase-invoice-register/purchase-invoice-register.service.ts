import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PurchaseInvoiceHistoryService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  InvRptPurchaseInvoicePurchaseAvgRateByItem_221(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvRptPurchaseInvoicePurchaseAvgRateByItem_221", data, {
      headers: this.headers,
    });
  }

  InvRptPurchaseInvoicePurchaseAvgRateByItemSupplier_222(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvRptPurchaseInvoicePurchaseAvgRateByItemSupplier_222", data, {
      headers: this.headers,
    });
  }

  InvPurchaseInvoiceAvgRateBySupplier222(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/InvPurchaseInvoiceAvgRateBySupplier222", data, {
      headers: this.headers,
    });
  }

  InvRptPurchaseRegisterDetail_223(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvRptPurchaseRegisterDetail_223", data, {
      headers: this.headers,
    });
  }
  InvRptPurchaseBillRegister_224(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvRptPurchaseBillRegister_224", data, {
      headers: this.headers,
    });
  }

  RiceAndPaddyPurchaseReportPdf_231(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/RiceAndPaddyPurchaseReportPdf_231", data, {
      headers: this.headers,
    });
  }
  getBatch() {
    return this.http.post<any>(this.apiUrl + "InvCropYear/GetAll", {
      headers: this.headers,
    });
  }

  InventoryParentCategories(data) {
    return this.http.post<any>(this.apiUrl + "ItemCategory/InventoryParentCategories", data, {
      headers: this.headers,
    });
  }

  onBasisOfPurchaseHistory(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/InvoiceHistory", data, {
      headers: this.headers,
    });
  }

  RicePaddyPuchaseReport(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/RicePaddyPuchaseReport", data, {
      headers: this.headers,
    });
  }

  onBasisOfAvgRateByItem(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/InvPurchaseInvoiceAvgRateByItem221", data, {
      headers: this.headers,
    });
  }
}
