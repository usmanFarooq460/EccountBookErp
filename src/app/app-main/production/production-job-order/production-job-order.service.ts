import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProductionJobOrderService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  getPlantFeader(data) {
    return this.http.post<any>(this.apiUrl + "ProductionPlant/GetAll", data, {
      headers: this.headers,
    });
  }
  getExportContract(data) {
    return this.http.post<any>(this.apiUrl + "ExImLcOrder/GetLcOrderNo", data, {
      headers: this.headers,
    });
  }
  getItemType(data) {
    return this.http.post<any>(this.apiUrl + "ItemType/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  getItemCategory(data) {
    return this.http.post<any>(this.apiUrl + "ItemCategory/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  getUOM(data) {
    return this.http.post<any>(this.apiUrl + "UOMSchedule/SearchByObject", data, { headers: this.headers });
  }
  getWareHouse(data) {
    return this.http.post<any>(this.apiUrl + "InvWareHouse/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  getCropYear(data) {
    return this.http.post<any>(this.apiUrl + "InvCropYear/GetAll", data, {
      headers: this.headers,
    });
  }
  getAllItems(data) {
    return this.http.post<any>(this.apiUrl + "Item/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  getItemByExportContract(data) {
    return this.http.post<any>(this.apiUrl + "ExImLcOrder/ReadByExportSaleOrderIDNOrderItemId", data, {
      headers: this.headers,
    });
  }
  getBagType() {
    return this.http.get<any>(this.apiUrl + "InvPackingType/GetAll");
  }

  getDocNo(data) {
    return this.http.post<any>(this.apiUrl + "ProductionJobOrder/GetGenerateCode", data, {
      headers: this.headers,
    });
  }

  getPlanTypeSrNo(data) {
    return this.http.post<any>(this.apiUrl + "ProductionJobOrder/GetGenerateCodePlanType", data, {
      headers: this.headers,
    });
  }

  getAccounts(data) {
    return this.http.post<any>(this.apiUrl + "COAAllocation/AccountsComboFill", data, {
      headers: this.headers,
    });
  }
  getJobLot(data) {
    return this.http.post<any>(this.apiUrl + "JobLot/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  Save(data) {
    return this.http.post<any>(this.apiUrl + "ProductionJobOrder/Save", data, {
      headers: this.headers,
    });
  }

  GetByID(id) {
    let params = new HttpParams().set("Id", id);
    return this.http.get(this.apiUrl + "ProductionJobOrder/GetByID", { params: params });
  }
  GetAll(data) {
    return this.http.post<any>(this.apiUrl + "ProductionJobOrder/GetAll", data, {
      headers: this.headers,
    });
  }
  ProductionJobOrderSlipA(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/ProductionJobOrderSlipA", data, {
      headers: this.headers,
    });
  }
}
