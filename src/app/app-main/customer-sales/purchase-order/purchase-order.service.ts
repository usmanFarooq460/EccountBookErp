import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class LcOrderService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  SupplierCustomerAll(data) {
    return this.http.post<any>(this.apiUrl + "SupplierCustomer/ReadByOrganizationCompanyIdForExportShippinglineNClearingAgents", data, {
      headers: this.headers,
    });
  }
  CoaAllocationAccounts(data) {
    return this.http.post<any>(this.apiUrl + "COAAllocation/GetAll", data, {
      headers: this.headers,
    });
  }

  PackingMaterial(data) {
    return this.http.post<any>(this.apiUrl + "ExImPackMaterial/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  //Detail MethodFill
  Item(data) {
    return this.http.post<any>(this.apiUrl + "Item/ReadAllForExportCombo", data, {
      headers: this.headers,
    });
  }
  GetUom(data) {
    return this.http.post<any>(this.apiUrl + "UOMSchedule/SearchByObject", data, {
      headers: this.headers,
    });
  }
  GetUoms(data) {
    return this.http.post<any>(this.apiUrl + "UOM/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  //Save

  TestNameGetAll(data) {
    return this.http.post<any>(this.apiUrl + "ExImLookUps/GetByLookTypeId", data, {
      headers: this.headers,
    });
  }
  //UOM SHCheduyle
  ItemUomSchSave(data) {
    return this.http.post<any>(this.apiUrl + "UOMSchedule/Save", data, {
      headers: this.headers,
    });
  }

  //======================================25-Nov-2021

  PurchaseOrderSave(data) {
    return this.http.post<any>(this.apiUrl + "ExImLcOrderPurchaseOrder/Save", data, {
      headers: this.headers,
    });
  }
  GenerateCode(data) {
    return this.http.post<any>(this.apiUrl + "ExImLcOrderPurchaseOrder/GenerateCode", data, {
      headers: this.headers,
    });
  }
  GenerateDocCodeByLcContract(data) {
    return this.http.post<any>(this.apiUrl + "ExImLcOrderPurchaseOrder/GenerateDocCodeByLcContract", data, {
      headers: this.headers,
    });
  }
  FormHistoryData(data) {
    return this.http.post<any>(this.apiUrl + "ExImLcOrderPurchaseOrder/FormHistoryData", data, {
      headers: this.headers,
    });
  }

  GetLcOrderNo(data) {
    return this.http.post<any>(this.apiUrl + "ImLcOrder/GetLcOrderNo", data, {
      headers: this.headers,
    });
  }

  PurchaseOrderGetById(id) {
    return this.http.get<any>(this.apiUrl + "ExImLcOrderPurchaseOrder/GetByID", {
      params: this.params.set("Id", id),
    });
  }
  GetDataOnBaseOfLcContract(id) {
    return this.http.get<any>(this.apiUrl + "ImLcOrder/GetDetailImLcOrderByImLcOrderId", {
      params: this.params.set("Id", id),
    });
  }

  PurchaseOrderSlipB_805(data) {
    return this.http.post<any>(this.apiUrl + "ImportPdfReports/PurchaseOrderSlipB_805", data, {
      headers: this.headers,
    });
  }
  ImPuchaseOrderSlipAndRegister_805(data) {
    return this.http.post<any>(this.apiUrl + "ImportReports/ImPuchaseOrderSlipAndRegister_805", data, {
      headers: this.headers,
    });
  }
}
