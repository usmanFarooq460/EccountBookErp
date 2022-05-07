import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class FcyBankReceiptDesignService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  ChargesTypesGetAll(data) {
    return this.http.post<any>(this.apiUrl + "ExImProceedsChargesType/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  SupplierCustomerByPaymentTerm(data) {
    return this.http.post<any>(this.apiUrl + "ExImInvoice/GetInvoiceNoandPartiesForFcBankReceipts", data, {
      headers: this.headers,
    });
  }

  LcOrderNoGetAll(data) {
    return this.http.post<any>(this.apiUrl + "ExImLcOrder/GetLcOrderNoBySupplierCustomerId", data, {
      headers: this.headers,
    });
  }
}
