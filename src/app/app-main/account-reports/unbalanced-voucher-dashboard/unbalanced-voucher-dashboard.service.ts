import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApprovalDashboardService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  ReadUnbalancedVoucherDashboard(data) {
    return this.http.post<any>(this.apiUrl + "Dashboard/ReadUnBalancedVoucher", data, {
      headers: this.headers,
    });
  }
}
