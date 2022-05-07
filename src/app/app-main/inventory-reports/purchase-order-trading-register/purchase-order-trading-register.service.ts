import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class PurchaseOrderTradingRegisterService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(private http: HttpClient) {}

  PurchaseOrderDetailRegister(data) {
    return this.http.post<any>(this.apiUrl + "Inventory/PurchaseOrderDetailRegisterReport206", data, { headers: this.headers });
  }
  RptPurchaseOrderRegisterRice_206(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/RptPurchaseOrderRegisterRice_206", data, { headers: this.headers });
  }
}
