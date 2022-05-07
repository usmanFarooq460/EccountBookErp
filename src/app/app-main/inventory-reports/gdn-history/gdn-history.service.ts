import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class GdnHistoryService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  Gdnhistory(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/GdnHistory", data, {
      headers: this.headers,
    });
  }
  InvRptGdnRiceSlip_260(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvRptGdnRiceSlip_260", data, {
      headers: this.headers,
    });
  }
  InvRptGdnRegister_261(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvRptGdnRegister_261", data, {
      headers: this.headers,
    });
  }
}
