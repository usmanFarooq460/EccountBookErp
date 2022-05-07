import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class JobManagmentReportService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  constructor(private http: HttpClient) {}
  GetAllCombos(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/LedgerByJobLotDropDownAndLists", data, {
      headers: this.headers,
    });
  }
  LedgerByJobReport(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/VoucherLedgerByJobLot", data, {
      headers: this.headers,
    });
  }
  jobMangment155(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/jobMangment155", data, {
      headers: this.headers,
    });
  }
}
