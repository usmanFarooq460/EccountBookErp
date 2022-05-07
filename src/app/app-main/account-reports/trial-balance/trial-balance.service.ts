import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class TrialBalanceService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  trialBalance(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/TrialBalance", data, {
      headers: this.headers,
    });
  }

  AcRptTrialBalances_112(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptTrialBalances_112", data, {
      headers: this.headers,
    });
  }
}
