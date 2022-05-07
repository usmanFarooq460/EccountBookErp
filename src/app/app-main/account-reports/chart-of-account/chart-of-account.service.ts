import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ChartOfAccountReportService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  chartofaccount(data) {
    return this.http.post<any>(this.apiUrl + "ChartofAccount/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  AcRptChartOfAccounts_114(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptChartOfAccounts_114", data, {
      headers: this.headers,
    });
  }
}
