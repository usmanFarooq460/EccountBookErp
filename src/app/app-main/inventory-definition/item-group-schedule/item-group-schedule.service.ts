import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefineItemGroupScheduleService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}
  GetGroup(data) {
    return this.http.post<any>(this.apiUrl + "ItemGroup/GetAll", data, {
      headers: this.headers,
    });
  }
  GetUom(data) {
    return this.http.post<any>(this.apiUrl + "UOM/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  ItemGroupSchGetAll(data) {
    return this.http.post<any>(this.apiUrl + "ItemGroup_UOMSchedule/GetAll", data, {
      headers: this.headers,
    });
  }

  ItemGroupSchSave(data) {
    return this.http.post<any>(this.apiUrl + "ItemGroup_UOMSchedule/Save", data, {
      headers: this.headers,
    });
  }

  ItemGroupSchGetById(id) {
    return this.http.get<any>(this.apiUrl + "ItemGroup_UOMSchedule/GetByID", {
      params: this.params.set("Id", id),
    });
  }
}
