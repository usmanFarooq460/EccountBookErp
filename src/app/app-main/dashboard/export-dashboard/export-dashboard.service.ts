import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ExportDashboardService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  params = new HttpParams();

  constructor(private http: HttpClient) {}

  ReadDashboard(data) {
    return this.http.post<any>(this.apiUrl + "Dashboard/ExportDashboard", data, {
      headers: this.headers,
    });
  }
  ExportShipmentFollowUpReoprt(data) {
    return this.http.post<any>(this.apiUrl + "ExImShippedConsignmentFollowUps/ExportShipmentFollowUpReoprt", data, {
      headers: this.headers,
    });
  }
  //#endregion
}
