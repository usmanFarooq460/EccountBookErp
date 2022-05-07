import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SaleInvoiceHistoryService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  SaleInvoicehistory(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/InvSaleInvoiceRegister", data, {
      headers: this.headers,
    });
  }

  RptInvSaleInvoiceRegister_226(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/RptInvSaleInvoiceRegister_226", data, {
      headers: this.headers,
    });
  }

  InvSaleInvoiceCustomerBillReport301(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/InvSaleInvoiceCustomerBillReport301", data, {
      headers: this.headers,
    });
  }

  AcRptPurchaseSalesVoucherSlip_103(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/AcRptPurchaseSalesVoucherSlip_103", data, {
      headers: this.headers,
    });
  }
}
