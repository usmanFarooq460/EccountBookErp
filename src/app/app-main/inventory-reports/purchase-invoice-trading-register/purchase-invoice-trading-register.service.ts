import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class PurchaseInvoiceTradingService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  constructor(private http: HttpClient) {}
  GetInvoiceRegister(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/InvPurchaseInvoiceRegisterTradingPro", data, {
      headers: this.headers,
    });
  }

  RptPurchaseInvoiceRegister_229(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/RptPurchaseInvoiceRegister_229", data, {
      headers: this.headers,
    });
  }

  getJobLot(data) {
    return this.http.post<any>(this.apiUrl + "JobLot/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
}
