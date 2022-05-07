import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefineProvinceService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  getCountries(data) {
    return this.http.post<any>(this.apiUrl + "Country/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  getProvincesData(data) {
    return this.http.post<any>(this.apiUrl + "StateProvince/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  saveProvinceData(data) {
    return this.http.post<any>(this.apiUrl + "StateProvince/Save", data, {
      headers: this.headers,
    });
  }

  getProvinceById(Id) {
    let params = this.params.set("Id", Id);
    return this.http.get<any>(this.apiUrl + "StateProvince/GetByID", {
      headers: this.headers,
      params: params,
    });
  }
}
