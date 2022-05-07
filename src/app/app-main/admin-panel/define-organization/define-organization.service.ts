import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefineOrganizationService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  // Organization/Save
  Save(data) {
    return this.http.post<any>(this.apiUrl + "Organization/Save", data, {
      headers: this.headers,
    });
  }

  getAllOrganizations() {
    return this.http.get<any>(this.apiUrl + "Organization/GetAll", {
      headers: this.headers,
      // params: this.params.set("Id", id),
    });
  }
  // Organization/GetByID
  GetByID(id) {
    let params = new HttpParams();
    return this.http.get<any>(this.apiUrl + "Organization/GetByID", { headers: this.headers, params: params.set("Id", id) });
  }
}
