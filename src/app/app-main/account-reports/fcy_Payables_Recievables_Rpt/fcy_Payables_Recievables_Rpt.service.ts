import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class FcyPayablesRecievablesRptService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  constructor(private http: HttpClient) {}
  FcyPayablesRecievablesGetAll(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/FCYPayablesAndReceivables_Rpt", data, {
      headers: this.headers,
    });
  }
  FCY_LedgerAgainstAccountId(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/FCY_LedgerAgainstAccountId", data, {
      headers: this.headers,
    });
  }
  LatestCurrencyRates(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/LatestCurrencyRates", data, {
      headers: this.headers,
    });
  }
  getFcyVoucherPdfReport(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/FcyCustomerLedger133", data, {
      headers: this.headers,
    });
  }
  AccountTypeIdGet(data) {
    return this.http.post<any>(this.apiUrl + "AccountTypes/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
}
