import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class FcyPaymentService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  // GenerateCOde
  GenerateCode(data) {
    return this.http.post<any>(this.apiUrl + "ExImFCBankPaymensts/GenerateCode", data, {
      headers: this.headers,
    });
  }

  History(data) {
    return this.http.post<any>(this.apiUrl + "ExImFCBankPaymensts/HistoryForm", data, {
      headers: this.headers,
    });
  }
  InvoiceNumbersBySupplierId(data) {
    return this.http.post<any>(this.apiUrl + "ImInvoice/GetInvoiceNoForFcyPaymentVoucher", data, {
      headers: this.headers,
    });
  }
  ContractNumbersBySupplierId(data) {
    return this.http.post<any>(this.apiUrl + "ImLcOrder/GetLcOrderNoBySupplierCustomerId", data, {
      headers: this.headers,
    });
  }
  GetAmountsDataByInvoiceId(data) {
    return this.http.post<any>(this.apiUrl + "ImInvoice/GetInvoiceAmountAndPaidAmount", data, {
      headers: this.headers,
    });
  }
  GetRateDataByInvoiceId(data) {
    return this.http.post<any>(this.apiUrl + "ImInvoice/GetExchangeRateandCurrencyFromVoucher", data, {
      headers: this.headers,
    });
  }
  ProceedChargesAccountList(data) {
    return this.http.post<any>(this.apiUrl + "ExImProceedsChargesType/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  Save(data) {
    return this.http.post<any>(this.apiUrl + "ExImFCBankPaymensts/Save", data, {
      headers: this.headers,
    });
  }
  ProceedChargesAccountSave(data) {
    return this.http.post<any>(this.apiUrl + "ExImProceedsChargesType/Save", data, {
      headers: this.headers,
    });
  }

  GetBYId(id) {
    let params = new HttpParams().set("Id", id);
    return this.http.get(this.apiUrl + "ExImFCBankPaymensts/GetByID", {
      headers: this.headers,
      params: params,
    });
  }
  ProceedAccountGetById(id) {
    let params = new HttpParams().set("Id", id);
    return this.http.get(this.apiUrl + "ExImProceedsChargesType/GetByID", {
      headers: this.headers,
      params: params,
    });
  }
}
