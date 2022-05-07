import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SaleInvoiceTradeProService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  SaleInvoiceTradeProSlipHistory(data) {
    return this.http.post<any>(this.apiUrl + "InvSaleInvoice/SaleInvoiceTradeProRpt", data, {
      headers: this.headers,
    });
  }


}
