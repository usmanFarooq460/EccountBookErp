import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DeliveryOrderHistoryService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  DeliveryOrderHistory(data) {
    return this.http.post<any>(this.apiUrl + "InvDeliveryOrder/GetDeliveryOrderForApproval", data, {
      headers: this.headers,
    });
  }

  PDFReportSlip262(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/DeliveryOrderSlip_262", data, {
      headers: this.headers,
    });
  }
  DelvieryOrderRegister263(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/DeliveryOrderRegister263", data, {
      headers: this.headers,
    });
  }
}
