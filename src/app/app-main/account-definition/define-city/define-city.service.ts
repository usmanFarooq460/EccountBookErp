import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefineCityService {
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
  CityGetAll(data) {
    return this.http.post<any>(this.apiUrl + "City/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  CitySave(data) {
    return this.http.post<any>(this.apiUrl + "City/Save", data, {
      headers: this.headers,
    });
  }

  CityGetById(id) {
    return this.http.get<any>(this.apiUrl + "City/GetByID", {
      params: this.params.set("Id", id),
    });
  }
}
