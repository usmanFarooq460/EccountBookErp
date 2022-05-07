import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SaleOrderHistoryService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  saleorderhistory(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/SaleOrderHistory", data, {
      headers: this.headers,
    });
  }
  updatestatusandapproved(data) {
    return this.http.post<any>(this.apiUrl + "SaleOrder/UpdateStatusandIsApprovedbyOrderId", data, {
      headers: this.headers,
    });
  }
  InvRptSaleOderRegister_270(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvRptSaleOderRegister_270", data, {
      headers: this.headers,
    });
  }
  InvRptSalesOrderRegister_271(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvRptSalesOrderRegister_271", data, {
      headers: this.headers,
    });
  }
  InvRptSaleOrderSlipWithDespatchDetail_272(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvRptSaleOrderSlipWithDespatchDetail_272", data, {
      headers: this.headers,
    });
  }
}
