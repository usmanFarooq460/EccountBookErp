import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SaleInvoiceDirectRegisterService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  SaleInvoiceDirectRegister(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/InvSaleInvoiceDirectRegister", data, {
      headers: this.headers,
    });
  }

  InvSaleInvoice_302(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvSaleInvoice_302", data, {
      headers: this.headers,
    });
  }

  InvRptSaleBillDirectWithoutSO_294(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/InvRptSaleBillDirectWithoutSO_294", data, {
      headers: this.headers,
    });
  }

  AcRptVoucherSlip_118(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/AcRptVoucherSlip_118", data, {
      headers: this.headers,
    });
  }
}
