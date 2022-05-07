import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class GatePassInwardHistoryService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  GatePassInwardhistory(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/GatePassOutwardHistory", data, {
      headers: this.headers,
    });
  }
  InvRptGatePassOutwardRegister_291(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvRptGatePassOutwardRegister_291", data, {
      headers: this.headers,
    });
  }
}
