import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class TrialBalanceSelectedService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}
  accounts(data) {
    return this.http.post<any>(this.apiUrl + "ChartofAccount/ReadAllParentGroupAccount", data, {
      headers: this.headers,
    });
  }
  trailbalanceselected(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/SelectedTrialBalance", data, {
      headers: this.headers,
    });
  }

  ReadAllParentGroupAccount(data) {
    return this.http.post<any>(this.apiUrl + "ChartofAccount/ReadAllParentGroupAccount", data, {
      headers: this.headers,
    });
  }

  AcRptTrialBalanceSelectedGroupAc_113(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptTrialBalanceSelectedGroupAc_113", data, {
      headers: this.headers,
    });
  }

  AcRptTrialBalanceSelectedCurrent_117(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptTrialBalanceSelectedCurrent_117", data, {
      headers: this.headers,
    });
  }
}
