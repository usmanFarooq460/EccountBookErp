import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class GatePassInwardService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  params = new HttpParams();
  constructor(private http: HttpClient) {}
  GpTypeGetAll() {
    return this.http
      .get<any>(this.apiUrl + "GatepassType/GetAll", {
        headers: this.headers,
      })
      .toPromise();
  }

  GenerateCode(data) {
    return this.http
      .post<any>(this.apiUrl + "GatePassInward/GenerategpCode", data, {
        headers: this.headers,
      })
      .toPromise();
  }

  GetNetWeightFromWbTransactions(data) {
    return this.http.post<any>(this.apiUrl + "WbTransactions/GetNetWeightFromWbTransactions", data, {
      headers: this.headers,
    });
  }

  GenerateGpTypeCode(obj) {
    return this.http.post<any>(this.apiUrl + "GatePassInward/GenerateGPTypeCode", obj, {
      headers: this.headers,
    });
  }

  GetDataFromLabAgainstGpId(data) {
    return this.http.post<any>(this.apiUrl + "GatePassInward/GetDataByGpId", data, {
      headers: this.headers,
    });
  }
  GatePassGetByGpDate(data) {
    return this.http.post<any>(this.apiUrl + "GatePassInward/ReadByGPDate", data, {
      headers: this.headers,
    });
  }

  GetOrderType(data) {
    return this.http
      .post<any>(this.apiUrl + "GatePassInward/GetOrderType", data, {
        headers: this.headers,
      })
      .toPromise();
  }

  GetSupplierByPurchaseOrderNo(data) {
    return this.http.post<any>(this.apiUrl + "SupplierCustomer/GetSupplierByPurchaseOrderNo", data, {
      headers: this.headers,
    });
  }
  GetSupplierByImportPurchaseContract(data) {
    return this.http.post<any>(this.apiUrl + "SupplierCustomer/GetSupplierByImportPurchaseContract", data, {
      headers: this.headers,
    });
  }
  GetContainerNoForImport(data) {
    return this.http.post<any>(this.apiUrl + "ExImLcOrderPurchaseOrder/GetContainerNosByOrderId", data, {
      headers: this.headers,
    });
  }
  //Crud
  // GetPendingGatepass() {
  //   return this.http.get<any>(this.apiUrl + "GatePassInward/GetPendingGatepass");
  // }
  GatepassSave(data) {
    return this.http.post<any>(this.apiUrl + "GatePassInward/Save", data, {
      headers: this.headers,
    });
  }
  GatepassHistory(data) {
    return this.http.post<any>(this.apiUrl + "GatePassInward/GatepassHistory", data, {
      headers: this.headers,
    });
  }
  OutstandingSupplyOrder(data) {
    return this.http.post<any>(this.apiUrl + "GatePassInward/GetOutstandingSupplyOrderForGatePassInward", data, {
      headers: this.headers,
    });
  }
  GatepassGetById(id) {
    return this.http.get<any>(this.apiUrl + "GatePassInward/GetByID", {
      params: this.params.set("Id", id),
    });
  }
  TotalReceivedQuantityByPoId(data) {
    return this.http.post<any>(this.apiUrl + "GatePassInward/GetTotalReceivedQtyByPurchaseOrderId", data, {
      headers: this.headers,
    });
  }
  // getSupplyOrderById(id) {
  //   return this.http.get<any>(this.apiUrl + "InvSupplyOrder/GetByID", {
  //     params: this.params.set("Id", id),
  //   });
  // }
}
