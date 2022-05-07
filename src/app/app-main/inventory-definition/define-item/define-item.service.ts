import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefineItemService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
  });
  params = new HttpParams();
  constructor(private http: HttpClient) {}
  //Hisotry
  ItemGetAll(data) {
    return this.http.post<any>(this.apiUrl + "Item/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  //Form

  GenerateCodeByCatagoryId(data) {
    return this.http.post<any>(this.apiUrl + "Item/GenerateCodeByCategoryId", data, {
      headers: this.headers,
    });
  }
  GetGLAccountbyItemCategoryId(data) {
    return this.http.post<any>(this.apiUrl + "Item/GetGLAccountbyItemCategoryId", data, {
      headers: this.headers,
    });
  }

  ItemGroup(data) {
    return this.http.post<any>(this.apiUrl + "ItemGroup/GetAll", data);
  }
  getCompany(data) {
    return this.http.post<any>(this.apiUrl + "Company/GetAll", data, {
      headers: this.headers,
    });
  }
  ItemBaseUnit(data) {
    return this.http.post<any>(this.apiUrl + "UOM/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  ItemSave(data) {
    return this.http.post<any>(this.apiUrl + "Item/Save", data, {
      headers: this.headers,
    });
  }

  ItemReadById(id) {
    return this.http.get<any>(this.apiUrl + "Item/GetByID", {
      params: this.params.set("Id", id),
    });
  }
}
