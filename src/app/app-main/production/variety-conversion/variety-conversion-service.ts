import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class VarietyConversionService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  constructor(private http: HttpClient) {}

  getWareHouse(data) {
    return this.http.post<any>(this.apiUrl + "InvWareHouse/GetByOrganizationCompanyId", data);
  }

  getItem(data) {
    return this.http.post<any>(this.apiUrl + "Item/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  getUOM(data) {
    return this.http.post<any>(this.apiUrl + "UOMSchedule/SearchByObject", data, { headers: this.headers });
  }

  getCropYear() {
    return this.http.post<any>(this.apiUrl + "InvCropYear/GetAll", {});
  }

  getJobLot(data) {
    return this.http.post<any>(this.apiUrl + "JobLot/GetByOrganizationCompanyId", data);
  }

  getBagType() {
    return this.http.get<any>(this.apiUrl + "InvPackingType/GetAll");
  }

  getDocumentNo(data) {
    return this.http.post<any>(this.apiUrl + "InvStockConversion/GenerateCode", data);
  }

  getStockConversionById(id) {
    let params = new HttpParams().set("Id", id);
    return this.http.get(this.apiUrl + "InvStockConversion/GetByID", { params: params });
  }

  getStockConversion(data) {
    return this.http.post<any>(this.apiUrl + "InvStockConversion/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  ItemStockFilterFromInventoryTransaction(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/ItemStockFilterFromInventoryTransaction", data, {
      headers: this.headers,
    });
  }

  ConversionByStockSlip_605(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/ConversionByStockSlip_605", data, {
      headers: this.headers,
    });
  }

  MoistureSlabGetAll(data) {
    return this.http.post<any>(this.apiUrl + "MoistureSlab/MoistureSlabGetAll", data, {
      headers: this.headers,
    });
  }

  getCOAAllocation(data) {
    return this.http.post<any>(this.apiUrl + "COAAllocation/GetAll", data);
  }

  getStockNAverageRate(data) {
    return this.http.post<any>(this.apiUrl + "InvStockConversion/GetInventoryStockEvalutionNGetAvgRate", data);
  }

  saveStockConversion(data) {
    return this.http.post<any>(this.apiUrl + "InvStockConversion/Save", data);
  }
}
