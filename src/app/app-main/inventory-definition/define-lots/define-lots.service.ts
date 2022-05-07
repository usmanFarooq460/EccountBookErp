import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefineLotsService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  JobLotGetAll(data) {
    return this.http.post<any>(this.apiUrl + "JobLot/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  JobLotSave(data) {
    return this.http.post<any>(this.apiUrl + "JobLot/Save", data, {
      headers: this.headers,
    });
  }

  JobLotGetById(id) {
    return this.http.get<any>(this.apiUrl + "JobLot/GetByID", {
      params: this.params.set("Id", id),
    });
  }
}
