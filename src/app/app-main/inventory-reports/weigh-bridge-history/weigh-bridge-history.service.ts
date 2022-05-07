import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class weighBridgeHistoryService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  weighBridgehistory(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/ReadWBHistory", data, {
      headers: this.headers,
    });
  }
  InvRptWeighBridgeRegister_281(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvRptWeighBridgeRegister_281", data, {
      headers: this.headers,
    });
  }
}
