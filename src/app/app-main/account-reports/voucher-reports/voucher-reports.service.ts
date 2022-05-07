import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class VoucherReportsService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(private http: HttpClient) {}

  // documentType() {
  //   return this.http.get<any>(this.apiUrl + "DocumentType/GetVoucherAll", {
  //     headers: this.headers,
  //   });
  // }
  documentType() {
    return this.http.get<any>(this.apiUrl + "DocumentType/GetByOrganizationCompanyId");
  }
  VouchersReport(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/VoucherValidation", data, {
      headers: this.headers,
    });
  }

  AcRptVoucherSlip_118(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptVoucherSlip_118", data, {
      headers: this.headers,
    });
  }
}
