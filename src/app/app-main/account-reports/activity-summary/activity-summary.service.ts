import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ActivitySummaryService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  activitySummary(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/ReadByActivitySummary", data, {
      headers: this.headers,
    }).toPromise()
  }

  AcRptActivitySummery_110(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptActivitySummery_110", data, {
      headers: this.headers,
    });
  }

  AcRptAccountsActivityDetail_116(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptAccountsActivityDetail_116", data, {
      headers: this.headers,
    });
  }
}
