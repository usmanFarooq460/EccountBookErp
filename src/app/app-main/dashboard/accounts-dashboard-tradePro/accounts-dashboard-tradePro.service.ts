import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AccountDashboardTradeProService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  accountDashboard(data) {
    return this.http.post<any>(this.apiUrl + "Dashboard/AccountDashboard", data, {
      headers: this.headers,
    });
  }
}
