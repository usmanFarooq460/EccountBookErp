import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class ItemPerameterService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  params = new HttpParams();

  constructor(private http: HttpClient) {}
  LabAnalysisStandardSave(data) {
    return this.http.post<any>(this.apiUrl + "InvLabSampleLogRegister/Save", data, {
      headers: this.headers,
    });
  }
  GetById(id) {
    return this.http.get<any>(this.apiUrl + "InvLabSampleLogRegister/GetById", {
      params: this.params.set("Id", id),
    });
  }
  GetAll(data) {
    return this.http.post<any>(this.apiUrl + "InvLabSampleLogRegister/GetAll", data, {
      headers: this.headers,
    });
  }
  GenerateCode(data) {
    return this.http
      .post<any>(this.apiUrl + "InvLabSampleLogRegister/GenerateCode", data, {
        headers: this.headers,
      })
      .toPromise();
  }
}
