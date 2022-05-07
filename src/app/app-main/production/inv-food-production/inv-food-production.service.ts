import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ThrowStmt } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class InvFoodProductionService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  GetGlAccountsByJobOrderId(data) {
    return this.http.post<any>(this.apiUrl + "ProductionJobOrder/GetGlAccountsByJobOrderId", data, {
      headers: this.headers,
    });
  }
  // Item/GetAvgRateAndStockInHand
  getAverageRateOnItemLeave(data) {
    return this.http.post<any>(this.apiUrl + "Item/GetAvgRateAndStockInHand", data, {
      headers: this.headers,
    });
  }

  // foodProduction/GetInPutTotalQtyandWeightByJobOrderId
  GetInPutTotalQtyandWeightByJobOrderId(data) {
    return this.http.post<any>(this.apiUrl + "foodProduction/GetInPutTotalQtyandWeightByJobOrderId", data, {
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

  GetSerialNumberForInvFoodProdcution(data) {
    return this.http
      .post<any>(this.apiUrl + "foodProduction/GetSerialNumber", data, {
        headers: this.headers,
      })
      .toPromise();
  }

  Save(data) {
    return this.http.post<any>(this.apiUrl + "foodProduction/Save", data, {
      headers: this.headers,
    });
  }

  FormHistoryOfInvFoodProduction(data) {
    return this.http.post<any>(this.apiUrl + "foodProduction/FormHistory", data, {
      headers: this.headers,
    });
  }

  GetByID(Id) {
    let params = new HttpParams().set("Id", Id);
    return this.http.get<any>(this.apiUrl + "foodProduction/GetByID", {
      headers: this.headers,
      params: params,
    });
  }
}
