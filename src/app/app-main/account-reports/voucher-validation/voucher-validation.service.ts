import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class VoucherValidationService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(private http: HttpClient) {}

  documentType() {
    return this.http.get<any>(this.apiUrl + "DocumentType/GetByOrganizationCompanyId");
  }

  VoucherValidationReport(data) {
    return this.http.post<any>(this.apiUrl + "AccountsReports/VoucherValidation", data, {
      headers: this.headers,
    });
  }

  AcRptVoucherValidation_115(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptVoucherValidation_115", data, {
      headers: this.headers,
    });
  }
  AcRptVoucherValidation2_119(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptVoucherValidation2_119", data, {
      headers: this.headers,
    });
  }
}
