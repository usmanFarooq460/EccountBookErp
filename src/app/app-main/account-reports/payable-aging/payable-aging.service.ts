import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PayableAgingService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  payableaging(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/PayableAging", data, {
      headers: this.headers,
    });
  }

  AcRptPayablesAging_120(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptPayablesAging_120", data, {
      headers: this.headers,
    });
  }
}
