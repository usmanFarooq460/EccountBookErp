import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class BanksBalanceService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  BankBalnceActivitySummary(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/ReadByActivitySummary", data, {
      headers: this.headers,
    });
  }
  AccountTypesGet(data) {
    return this.http.post<any>(this.apiUrl + "AccountTypes/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  AcRptTrialBalanceSelectedGroupAc_591(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptTrialBalanceSelectedGroupAc_591", data, {
      headers: this.headers,
    });
  }

  BankBalances_590(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/BankBalances_590", data, {
      headers: this.headers,
    });
  }
  AccountTitleGet(data) {
    return this.http.post<any>(this.apiUrl + "COAAllocation/GetAll", data, {
      headers: this.headers,
    });
  }

  SelectedAccountsSummary(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/CashandBankBalancesSummery", data, {
      headers: this.headers,
    }).toPromise();
  }
  GetBankPaymentReceipt(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/BankBalancesReport", data, {
      headers: this.headers,
    }).toPromise()
  }
}
