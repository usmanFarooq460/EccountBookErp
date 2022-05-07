import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefineCompanyService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(private http: HttpClient) {}

  GetRemainingCompaniesCount(id) {
    let params = new HttpParams().set("Id", id);
    return this.http.get(this.apiUrl + "Organization/GetRemainingCompaniesCount", {
      headers: this.headers,
      params: params,
    });
  }
  GetByID(id) {
    let params = new HttpParams().set("Id", id);
    return this.http.get(this.apiUrl + "Company/GetByID", {
      headers: this.headers,
      params: params,
    });
  }
  Save(data) {
    return this.http.post<any>(this.apiUrl + "Company/Save", data, {
      headers: this.headers,
    });
  }
  History(data) {
    return this.http.post<any>(this.apiUrl + "Company/GetHistory", data, {
      headers: this.headers,
    });
  }
}
