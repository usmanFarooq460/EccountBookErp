import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class BalanceSheetService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  BalanceSheet(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/AccountsBalanceSheetStandardRpt", data, {
      headers: this.headers,
    });
  }

  BLSummaryReport153(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/BalanceSheetStatement153", data, {
      headers: this.headers,
    });
  }

  ProfitLossReport154(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/ProfitLoss154", data, {
      headers: this.headers,
    });
  }
}
