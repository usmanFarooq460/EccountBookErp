import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefineCountryService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  CountryGetAll(data) {
    return this.http.post<any>(this.apiUrl + "Country/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  CountrySave(data) {
    return this.http.post<any>(this.apiUrl + "Country/Save", data, {
      headers: this.headers,
    });
  }

  CountryGetById(data) {
    return this.http.post<any>(this.apiUrl + "Country/GetByID", data, {
      headers: this.headers,
    });
  }
}
