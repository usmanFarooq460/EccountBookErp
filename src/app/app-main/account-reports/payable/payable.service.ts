import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PayableService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  payable(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/Payable", data, {
      headers: this.headers,
    });
  }

  Accounts_Payables_Rpt_121(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/Accounts_Payables_Rpt_121", data, {
      headers: this.headers,
    });
  }
}
