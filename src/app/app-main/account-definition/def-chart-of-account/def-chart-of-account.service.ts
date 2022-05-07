import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefChartOfAccountService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(private http: HttpClient) {}

  getParentAccountList(data) {
    return this.http.post<any>(this.apiUrl + "ChartofAccount/ReadAllParentGroupAccount", data, { headers: this.headers });
  }

  getAccountCodeClassLevelList(data) {
    return this.http.post<any>(this.apiUrl + "ChartofAccount/GenerateCodeByParentAccountCode", data, { headers: this.headers });
  }

  getAccountTypeList(data) {
    return this.http.post<any>(this.apiUrl + "AccountTypes/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  getPLNotesList() {
    return this.http.get<any>(this.apiUrl + "AccountNotes/GetAll_PL", {
      headers: this.headers,
    });
  }

  getBSNotesList() {
    return this.http.get<any>(this.apiUrl + "AccountNotes/GetAll", {
      headers: this.headers,
    });
  }

  addChartOfAccount(data) {
    return this.http.post<any>(this.apiUrl + "ChartofAccount/Save", data, {
      headers: this.headers,
    });
  }
  chartofaccount(data) {
    return this.http.post<any>(this.apiUrl + "ChartofAccount/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  getCompany(data) {
    return this.http.post<any>(this.apiUrl + "Company/GetAll", data, {
      headers: this.headers,
    });
  }
  UpdateChartOfAccountById(data) {
    return this.http.post<any>(this.apiUrl + "ChartofAccount/DELETEANDUPDATECHARTOFACCOUNTBYID", data, {
      headers: this.headers,
    });
  }
  // Update
}
