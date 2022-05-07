import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class FcyLedgerService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  constructor(private http: HttpClient) {}

  FCY_LedgerAgainstAccountId(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/FCY_LedgerAgainstAccountId", data, {
      headers: this.headers,
    });
  }
  FcyGeneralLedger_156(data) {
    return this.http.post<any>(this.apiUrl + "AccountsPdfReports/FcyGeneralLedger_156", data, {
      headers: this.headers,
    });
  }
}
