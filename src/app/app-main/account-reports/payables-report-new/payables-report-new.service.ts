import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PayablesReportService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  Payables(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/PayablesWithLastBillAndPaidAmount", data, {
      headers: this.headers,
    }).toPromise()
  }
  ReadAllParentGroupAccount(data) {
    return this.http.post<any>(this.apiUrl + "ChartofAccount/ReadAllParentGroupAccount", data, {
      headers: this.headers,
    }).toPromise()
  }
  AcRptPayables_141(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/PayablesWithAmountAndDate_141", data, {
      headers: this.headers,
    });
  }
}
