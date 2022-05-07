import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AccountDashboardTradeProService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  InventoryDashboardTradePro(data) {
    return this.http.post<any>(this.apiUrl + "Dashboard/InventoryDashboardTradePro", data, {
      headers: this.headers,
    });
  }
  InventoryProfitLossReportTradePro(data) {
    return this.http.post<any>(this.apiUrl + "Dashboard/ProfitLossReportTradePro", data, {
      headers: this.headers,
    });
  }
  SupplierCustomer(data) {
    return this.http.post<any>(this.apiUrl + "SupplierCustomer/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  ProfitLossReportpdfRegister(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/ProfitLossReportTradePro", data, {
      headers: this.headers,
    });
  }
}
