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

  LabPerameterSave(data) {
    return this.http.post<any>(this.apiUrl + "InvLabAnalysisItems/Save", data, {
      headers: this.headers,
    });
  }

  GetAllNReadById(data) {
    return this.http.post<any>(this.apiUrl + "InvLabAnalysisItems/GetAllNReadById", data, {
      headers: this.headers,
    });
  }
}
