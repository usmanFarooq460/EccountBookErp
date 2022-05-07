import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class GeneralLedgerService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}
  CoaAccounts(data) {
    return this.http.post<any>(this.apiUrl + "ChartofAccount/DetailAccount", data, {
      headers: this.headers,
    });
  }

  generalLedger(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/GeneralLedger", data, {
      headers: this.headers,
    });
  }

  pdfgeneralLedger(data) {
    return this.http.post<any>(this.apiUrl + "AccountsPdfReports/GeneralLedgerPdfReprot", data, {
      headers: this.headers,
    });
  }

  AcRptGeneralLedger_105(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptGeneralLedger_105", data, {
      headers: this.headers,
    });
  }

  AcRptGeneralLedgerB_106(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptGeneralLedgerB_106", data, {
      headers: this.headers,
    });
  }

  AcRptQuantativeLedger_107(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptQuantativeLedger_107", data, {
      headers: this.headers,
    });
  }

  AcRptGeneralLedgerSummery_108(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptGeneralLedgerSummery_108", data, {
      headers: this.headers,
    });
  }
  //==========================================================
  GeneralLedgerDetailRpt(data) {
    return this.http
      .post<any>(this.apiUrl + "AccountsReports/GeneralLedgerWithOffsetAccount", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GeneralLedgerSummary_IRpt(data) {
    return this.http
      .post<any>(this.apiUrl + "AccountsReports/GeneralLedgerSummery", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GeneralLedgerSummary_IIRpt(data) {
    return this.http
      .post<any>(this.apiUrl + "AccountsReports/GeneralLedger2Format_Rpt", data, {
        headers: this.headers,
      })
      .toPromise();
  }
}
