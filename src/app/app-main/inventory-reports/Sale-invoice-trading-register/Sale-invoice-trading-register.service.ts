import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class SaleInvoiceTradingService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  constructor(private http: HttpClient) {}
  GetInvoiceRegister(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/InvSaleInvoiceRegisterTradingPro", data, {
      headers: this.headers,
    });
  }

  RptSaleInvoiceRegister_231(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/RptSaleInvoiceRegister_231", data, {
      headers: this.headers,
    });
  }
}
