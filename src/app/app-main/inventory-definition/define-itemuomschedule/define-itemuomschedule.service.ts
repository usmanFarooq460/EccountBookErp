import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefineItemUomScheduleService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}
  GetItems(data) {
    return this.http.post<any>(this.apiUrl + "Item/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  GetUom(data) {
    return this.http.post<any>(this.apiUrl + "UOM/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  ItemUomSchGetAll(data) {
    return this.http.post<any>(this.apiUrl + "UOMSchedule/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  ItemUomSchSave(data) {
    return this.http.post<any>(this.apiUrl + "UOMSchedule/Save", data, {
      headers: this.headers,
    });
  }

  ItemUomSchGetById(id) {
    return this.http.get<any>(this.apiUrl + "UOMSchedule/GetByID", {
      params: this.params.set("Id", id),
    });
  }
}
