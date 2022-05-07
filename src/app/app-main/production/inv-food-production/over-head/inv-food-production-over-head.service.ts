import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class InvFoodProductionOverHeadService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  GenerateCode(data) {
    return this.http
      .post<any>(this.apiUrl + "InvFoodProductionOverHeads/GenerateCode", data, {
        headers: this.headers,
      })
      .toPromise();
  }

  Save(data) {
    return this.http.post<any>(this.apiUrl + "InvFoodProductionOverHeads/Save", data, {
      headers: this.headers,
    });
  }

  GetJobOrderNoForInvFoodProduction(data) {
    return this.http
      .post<any>(this.apiUrl + "ProductionJobOrder/GetJobOrderNoForInvFoodProduction", data, {
        headers: this.headers,
      })
      .toPromise();
  }

  FormHistoryOfPackingType(data) {
    return this.http.post<any>(this.apiUrl + "InvFoodProductionOverHeads/GetAll", data, {
      headers: this.headers,
    });
  }

  GetByID(Id) {
    let params = new HttpParams().set("Id", Id);
    return this.http.get(this.apiUrl + "InvFoodProductionOverHeads/GetByID", {
      headers: this.headers,
      params: params,
    });
  }
}
