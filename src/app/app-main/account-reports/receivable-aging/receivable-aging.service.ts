import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ReceivableAgingService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  receivableaging(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/ReceivableAging", data, {
      headers: this.headers,
    });
  }

  AcRptReceivablesAging_111(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptReceivablesAging_111", data, {
      headers: this.headers,
    });
  }
}
