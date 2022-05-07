import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ItemGroupService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  LabGroupSave(data) {
    return this.http.post<any>(this.apiUrl + "InvLabAnalysisGroup/Save", data, {
      headers: this.headers,
    });
  }

  GetAllNReadById(data) {
    return this.http.post<any>(this.apiUrl + "InvLabAnalysisGroup/GetAllNReadById", data, {
      headers: this.headers,
    });
  }
}
