import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class DefinePlantService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}
  save(data) {
    return this.http.post<any>(this.apiUrl + "ProductionPlant/Save", data, {
      headers: this.headers,
    });
  }

  getAll(data) {
    return this.http.post<any>(this.apiUrl + "ProductionPlant/GetAll", data, {
      headers: this.headers,
    });
  }

  // ProductionPlant/GetById
  GetById(Id) {
    let params = this.params.set("Id", Id);
    return this.http.get<any>(this.apiUrl + "ProductionPlant/GetById", {
      headers: this.headers,
      params: params,
    });
  }
}
