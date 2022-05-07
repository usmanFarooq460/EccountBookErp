import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ReceivablesReportService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  Receivable(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/Receivable", data, {
      headers: this.headers,
    }).toPromise()
  }
  SupplierCustomerRegister(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/SupplierCustomerRegister", data, {
      headers: this.headers,
    });
  }
  ReadAllParentGroupAccount(data) {
    return this.http.post<any>(this.apiUrl + "ChartofAccount/ReadAllParentGroupAccount", data, {
      headers: this.headers,
    }).toPromise()
  }
  AcRptReceivables_122(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptAccounts_ReceivablesWithStatus_122", data, {
      headers: this.headers,
    });
  }
}
