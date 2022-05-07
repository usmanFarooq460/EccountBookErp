import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefineItemPricingScheduleService {
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
    return this.http.post<any>(this.apiUrl + "UOMSchedule/SearchByObject", data, {
      headers: this.headers,
    });
  }
  ItemPriceTypes(data) {
    return this.http.get<any>(this.apiUrl + "ItemPriceTypes/GetAll", data);
  }

  ItemPricingSchGetAll(data) {
    return this.http.post<any>(this.apiUrl + "ItemPricingSchedule/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  ItemPricingSchSave(data) {
    return this.http.post<any>(this.apiUrl + "ItemPricingSchedule/Save", data, {
      headers: this.headers,
    });
  }

  ItemPricingSchGetById(id) {
    return this.http.get<any>(this.apiUrl + "ItemPricingSchedule/GetByID", {
      params: this.params.set("Id", id),
    });
  }
}
