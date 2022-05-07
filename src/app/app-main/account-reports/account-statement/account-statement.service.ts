import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AccountStatmentService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}
  CoaAccounts(data) {
    return this.http.post<any>(this.apiUrl + "COAAllocation/GetAll", data, {
      headers: this.headers,
    });
  }

  accountstatement(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/GeneralLedgerStatement", data, {
      headers: this.headers,
    });
  }

  AcRptGeneralLedgerStatement_109(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptGeneralLedgerStatement_109", data, {
      headers: this.headers,
    });
  }
}
