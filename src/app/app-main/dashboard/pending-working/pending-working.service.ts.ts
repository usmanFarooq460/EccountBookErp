import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class PendingWorkingService {
  apiUrl = environment.apiUrl;

  params = new HttpParams();
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  constructor(private http: HttpClient) {}

  pendingWorkGetAll(data) {
    return this.http.post<any>(this.apiUrl + "InvDashboardsPendingWork/DashboardsPendingWork", data, {
      headers: this.headers,
    });
  }

  // pendingWorkGetAll(data) {
  //   return this.http.pos<any>(this.apiUrl + "InvDashboardsPendingWork/DashboardsPendingWork",data, {

  //   });
  // }
}
