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
    return this.http.post<any>(this.apiUrl + "InventoryReports/GatepassInwardHistory", data, {
      headers: this.headers,
    });
  }
  InvRptGatePassInwardRegisterA_253(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvRptGatePassInwardRegisterA_253", data, {
      headers: this.headers,
    });
  }
  getpdfReport(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/GatePassInwardSlipandRegisterPdfReprot", data, {
      headers: this.headers,
    });
  }
}
