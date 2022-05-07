import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DipReadingService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  ItemGetAll(data) {
    return this.http.post<any>(this.apiUrl + "Item/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  GetUom(data) {
    return this.http.post<any>(this.apiUrl + "UOMSchedule/SearchByObject", data, {
      headers: this.headers,
    });
  }
  //============================================================================
  GenerateCode(data) {
    return this.http.post<any>(this.apiUrl + "InvDipReading/GenerateCode", data, {
      headers: this.headers,
    });
  }

  //====================================================================

  Save(data) {
    return this.http.post<any>(this.apiUrl + "InvDipReading/Save", data, {
      headers: this.headers,
    });
  }

  //=====================================================================
  DipChartHistory(data) {
    return this.http.post<any>(this.apiUrl + "InvDipReading/GetAll", data, {
      headers: this.headers,
    });
  }
  DipChartGetById(id) {
    return this.http.get<any>(this.apiUrl + "InvDipReading/GetByID", {
      params: this.params.set("Id", id),
    });
  }
  //====================================================================PDF REport
  InvDipReadingSlip296(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/InvDipReadingSlip296", data, {
      headers: this.headers,
    });
  }
}
