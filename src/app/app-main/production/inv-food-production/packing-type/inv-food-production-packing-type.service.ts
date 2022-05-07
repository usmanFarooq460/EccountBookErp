import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class InvFoodProductionPackingTypeService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  // POST api/InvFoodProductionPackingMaterial/GenerateCode
  GenerateCode(data) {
    return this.http
      .post<any>(this.apiUrl + "InvFoodProductionPackingMaterial/GenerateCode", data, {
        headers: this.headers,
      })
      .toPromise();
  }

  GetJobOrderNoForInvFoodProduction(data) {
    return this.http
      .post<any>(this.apiUrl + "ProductionJobOrder/GetJobOrderNoForInvFoodProduction", data, {
        headers: this.headers,
      })
      .toPromise();
  }

  Save(data) {
    return this.http.post<any>(this.apiUrl + "InvFoodProductionPackingMaterial/Save", data, {
      headers: this.headers,
    });
  }

  // InvFoodProductionPackingMaterial/FormHistory
  FormHistoryOfPackingType(data) {
    return this.http.post<any>(this.apiUrl + "InvFoodProductionPackingMaterial/FormHistory", data, {
      headers: this.headers,
    });
  }

  GetByID(Id) {
    let params = new HttpParams().set("Id", Id);
    return this.http.get(this.apiUrl + "InvFoodProductionPackingMaterial/GetByID", {
      headers: this.headers,
      params: params,
    });
  }
}
