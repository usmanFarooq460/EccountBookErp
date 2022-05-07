import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CheckBookRegistrationService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(private http: HttpClient) {}

  //Doc Number  
  getOutstandingCheqNo(data) {
    return this.http.post<any>(this.apiUrl + "CheqBookHeader/OutstandingCheqNo", data, {
      headers: this.headers,
    });
  }

  Save(data) {
    return this.http.post<any>(this.apiUrl + "CheqBookHeader/Save", data, {
      headers: this.headers,
    });
  }

  // CheqBookHeader/GetByOrganizationCompanyId History
  
  GetCheqBookHeaderHistory(data) {
    return this.http.post<any>(this.apiUrl + "CheqBookHeader/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

}
