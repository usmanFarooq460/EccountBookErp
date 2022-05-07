import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class StockAdjustmentReasonsService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  // POST api/DrmLookUps/Save
  save(data) {
    return this.http.post<any>(this.apiUrl + "DrmLookUps/Save", data, {
      headers: this.headers,
    });
  }
  // GET api/DrmLookUps/GetByLookUpsTypeId?Id={Id}
  getHistoryOfDrmLookups(Id) {
    let params = new HttpParams().set("Id", Id);
    return this.http.get<any>(this.apiUrl + "DrmLookUps/GetByLookUpsTypeId", {
      headers: this.headers,
      params: params,
    });
  }

  // GET api/DrmLookUps/GetByID?Id={Id}
  GetByID(Id){
    let params=new HttpParams().set("Id",Id);
    return this.http.get<any>(this.apiUrl+"DrmLookUps/GetByID",{
      headers:this.headers,
      params:params
    })
  }
}
