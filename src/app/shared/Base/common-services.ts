import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class CommonServices {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  constructor(private http: HttpClient) {}
  ItemsFromInventoryStocksEvaluations(data) {
    return this.http
      .post<any>(this.apiUrl + "Item/GetItemsFromInventoryStocksEvaluations", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  JobLotFromInventoryStocksEvaluations(data) {
    return this.http
      .post<any>(this.apiUrl + "Item/GetJobLotFromInventoryStocksEvaluations", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  CropYear(data) {
    return this.http
      .post<any>(this.apiUrl + "InvCropYear/GetAll", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  SupplierCustomerFromInventoryStocksEvaluations(data) {
    return this.http
      .post<any>(this.apiUrl + "Item/GetSupplierCustomerFromInventoryStocksEvaluations", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  DocumentTypeFromInventoryStocksEvaluations(data) {
    return this.http
      .post<any>(this.apiUrl + "Item/GetDocumentTypeFromInventoryStocksEvaluations", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  WarehouseFromInventoryStocksEvaluations(data) {
    return this.http
      .post<any>(this.apiUrl + "Item/GetWarehouseFromInventoryStocksEvaluations", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GetPaddyRiceParentCategories(data) {
    return this.http
      .post<any>(this.apiUrl + "Item/GetPaddyRiceParentCategories", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GetAvailableTransactionsForIssuance(data) {
    return this.http
      .post<any>(this.apiUrl + "InventoryStockEvalautionDetail/GetAvailableTransactionsForIssuance", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  CoaAllocationGetAll(data) {
    return this.http
      .post<any>(this.apiUrl + "COAAllocation/GetAll", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  configurations(data) {
    return this.http
      .post<any>(this.apiUrl + "ConfigrationsAllocation/HistoryConfiguration", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  getPackingType() {
    return this.http.get<any>(this.apiUrl + "InvPackingType/GetAll").toPromise();
  }
  getCOAAllocation(data) {
    return this.http
      .post<any>(this.apiUrl + "COAAllocation/GetAll", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  getItemsForComboBind(data) {
    return this.http
      .post<any>(this.apiUrl + "Item/GetAllbyCombobind", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //Export Service
  getItemsForExport(data) {
    return this.http
      .post<any>(this.apiUrl + "Item/ReadAllForExportCombo", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  getWareHouse(data) {
    return this.http.post<any>(this.apiUrl + "InvWareHouse/GetByOrganizationCompanyId", data, { headers: this.headers }).toPromise();
  }
  getJobLot(data) {
    return this.http.post<any>(this.apiUrl + "JobLot/GetByOrganizationCompanyId", data, { headers: this.headers }).toPromise();
  }
  getUOM(data) {
    return this.http.post<any>(this.apiUrl + "UOMSchedule/SearchByObject", data, { headers: this.headers }).toPromise();
  }
  SupplierCustomerForExport(data) {
    return this.http
      .post<any>(this.apiUrl + "SupplierCustomer/ReadByOrganizationCompanyIdForExport", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  ShippingLineNClearingAgentForExport(data) {
    return this.http
      .post<any>(this.apiUrl + "SupplierCustomer/ReadByOrganizationCompanyIdForExportShippinglineNClearingAgents", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  DeliveryTermExport(data) {
    return this.http
      .post<any>(this.apiUrl + "ExImDeliveryTerm/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  LcPaymentTerm(data) {
    return this.http
      .post<any>(this.apiUrl + "ExImLcPaymentTerm/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  SeaPorts(data) {
    return this.http
      .post<any>(this.apiUrl + "SeaPorts/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  MultiCurrency(data) {
    return this.http
      .post<any>(this.apiUrl + "MultiCurrency/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  BankGetAll(data) {
    return this.http
      .post<any>(this.apiUrl + "Bank/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  PackingTypeExportGetAll(data) {
    return this.http
      .post<any>(this.apiUrl + "ExImPackMaterial/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  ExportShippinglineNClearingAgents(data) {
    return this.http
      .post<any>(this.apiUrl + "SupplierCustomer/ReadByOrganizationCompanyIdForExportShippinglineNClearingAgents", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  ReadAllForItemsForServices(data) {
    return this.http
      .post<any>(this.apiUrl + "Item/ReadAllForItemsForServices", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  TaxesTypeGetForComboBind(data) {
    return this.http
      .post<any>(this.apiUrl + "TaxesTypes/GetForComboBind", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GetTaxScheduleMain(data) {
    return this.http
      .post<any>(this.apiUrl + "TaxScheduleMain/GetTaxSchedule", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  ExImInvoiceGetByOrganizationCompany(data) {
    return this.http
      .post<any>(this.apiUrl + "ExImInvoice/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GetInvoiceNo(data) {
    return this.http
      .post<any>(this.apiUrl + "ExImInvoice/GetInvoiceNo", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GetSupplierCustomer(data) {
    return this.http
      .post<any>(this.apiUrl + "SupplierCustomer/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GetCountry(data) {
    return this.http
      .post<any>(this.apiUrl + "Country/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GetByInvLookUpTypeId(data) {
    return this.http
      .post<any>(this.apiUrl + "InvLookUp/GetLookupsByTypeId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //============================================01-Dec-2021
  SupplierCustomerGetAll(data) {
    return this.http
      .post<any>(this.apiUrl + "SupplierCustomer/GetforComboBinding", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  PaymentTermsGetAll(data) {
    return this.http
      .post<any>(this.apiUrl + "InvDueTerms/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  getInventoryOtherItems(data) {
    return this.http
      .post<any>(this.apiUrl + "InventoryItemsOther/GetAll", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  // 13-Dec-2021
  ItemTypesGetAll(data) {
    return this.http
      .post<any>(this.apiUrl + "ItemType/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  ItemCategoriesGetAll(data) {
    return this.http
      .post<any>(this.apiUrl + "ItemCategory/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  ItemClassGetAll(data) {
    return this.http
      .post<any>(this.apiUrl + "ItemClass/GetAll", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  ItemsGetAll(data) {
    return this.http
      .post<any>(this.apiUrl + "Item/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  SupplierCustomerByOrganizationAndCompany(data) {
    return this.http
      .post<any>(this.apiUrl + "SupplierCustomer/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  ExImGetLcOrderNo(data) {
    return this.http
      .post<any>(this.apiUrl + "ExImLcOrder/GetLcOrderNo", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //==================================1 Jan 2022
  GetInventoryDefaultsFromConfiguration(data) {
    return this.http
      .post<any>(this.apiUrl + "InvGrn/GetByDefaultCropJobPackingTypeWarehouseCity", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  VehicleTypeGetAll(data) {
    return this.http.get<any>(this.apiUrl + "VehicleType/GetAll").toPromise();
  }
  CityGetByOrganizationAndCompany(data) {
    return this.http
      .post<any>(this.apiUrl + "City/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //---------------------------------------5 Jan 2022
  ItemsFromItemPricingSchedule(data) {
    return this.http
      .post<any>(this.apiUrl + "Item/GetItemsFromItemPricingSchedule", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //---------------------------------------6 Jan 2022
  UserAccountGetByOrganizationAndCompanyId(data) {
    return this.http
      .post<any>(this.apiUrl + "UserAccount/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  StaticColumnNames(data) {
    return this.http
      .post<any>(this.apiUrl + "CommonController/StaticColumnNames", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GetSalesManForSupplierustomer(data) {
    return this.http
      .post<any>(this.apiUrl + "SupplierCustomer/GetSalesManForSupplierustomer", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //================================================10 Jn 2022=====================================
  GetAvailableStockInQuantity(data) {
    return this.http
      .post<any>(this.apiUrl + "Item/GetCurrQtyByItemIdandWarehouse", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GetAverageRateAgainstAvailableQuanity(data) {
    return this.http
      .post<any>(this.apiUrl + "PosSaleInvoice/GetAvgRateByItemWareHouseId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //================================================12 Jan 2022
  CoaAllocationGetAllList(data) {
    return this.http
      .post<any>(this.apiUrl + "COAAllocation/GetAllList", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //===============================================20 Jan 2022
  GetConfigurationByOrgCompandConfigDescription(data) {
    return this.http
      .post<any>(this.apiUrl + "ConfigrationsAllocation/GetConfigurationByOrgCompandConfigDescription", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GetLcPurchaseOrderList(data) {
    return this.http
      .post<any>(this.apiUrl + "ExImLcOrderPurchaseOrder/GetPurchaseOrderNo", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  InventoryParentCategories(data) {
    return this.http
      .post<any>(this.apiUrl + "ItemCategory/InventoryParentCategories", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GetConfigKeyAndIdByConfigName(data) {
    let params = new HttpParams();
    params = params.append("ConfigName", data.ConfigName);
    params = params.append("OrganizationId", data.OrganizationId);
    params = params.append("CompanyId", data.CompanyId);
    return this.http.get<any>(this.apiUrl + "ConfigrationsAllocation/GetByKey", { params: params, headers: this.headers }).toPromise();
  }
  GetConfigIdForFirstTime(configName) {
    let params = new HttpParams().set("ConfigDescription", configName);
    return this.http.get<any>(this.apiUrl + "ConfigrationsAllocation/ReadByConfigDescription", { params: params, headers: this.headers }).toPromise();
  }
  //=======================================08-Feb-2022
  DashboardDynamicObjects(data) {
    return this.http
      .post<any>(this.apiUrl + "Dashboard/DashboardDynamicObjects", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  AccountsDashboard(data) {
    return this.http
      .post<any>(this.apiUrl + "Dashboard/AccountDashboard", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  OrgGroup_AccountsDashboard(data) {
    return this.http
      .post<any>(this.apiUrl + "OrganizationLevelDashboard/OrgGroup_AccountsDashboard", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //===============================================10 Feb-2022
  GetSupplierCustomerFromImInvoice(data) {
    return this.http
      .post<any>(this.apiUrl + "ImInvoice/GetSupplierForFcyPaymentVoucher", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GetAccountsByAccountTypeIds(data) {
    return this.http
      .post<any>(this.apiUrl + "COAAllocation/GetAccountTitleByAccountTypeIds", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GetSupplierCustomerFromImContract(data) {
    return this.http
      .post<any>(this.apiUrl + "ImLcOrder/GetImportCustomerByAdvancePayment", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //==================================================12 Feb-2022
  SupplierGroupGetAll(data) {
    return this.http
      .post<any>(this.apiUrl + "CustomerGroup/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //==================================================14 Feb-2022
  UserRightsByScreenName(data) {
    return this.http
      .post<any>(this.apiUrl + "UserRights/GetByUserIdScreenNameRightName", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GetUserRightByUserIdAndModuleName(data) {
    return this.http
      .post<any>(this.apiUrl + "UserRights/GetUserRightByUserIdAndModuleName", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //===================================================15 Feb-2022
  GetDetailAccountByDocumentTypeId(data) {
    return this.http
      .post<any>(this.apiUrl + "COAAllocation/GetDetailAccountByDocumentTypeId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  ReadBalanceBySelectedAccount(data) {
    return this.http
      .post<any>(this.apiUrl + "Voucher/ReadBalanceBySelectedAccount", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //==========================================================16 Feb-2022
  GetAllProvinces(data) {
    return this.http
      .post<any>(this.apiUrl + "StateProvince/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //========================================================= 19 Feb-2022
  GetEqvilentByItemId(data) {
    return this.http
      .post<any>(this.apiUrl + "Item/GetEqvilentByItemId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //=========================================================== 20 Feb-2022
  AccountsTypesGetAll(data) {
    return this.http
      .post<any>(this.apiUrl + "AccountTypes/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //==========================================================24 Feb-2022
  GetAllUomsByOrganizationCompany(data) {
    return this.http
      .post<any>(this.apiUrl + "UOMSchedule/GetByOrganizationCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //===========================================================25 Feb-2022
  ComanyGetById(id) {
    let params = new HttpParams();
    return this.http
      .get<any>(this.apiUrl + "Company/GetByID", {
        params: params.set("Id", id),
      })
      .toPromise();
  }
  //===========================================================3 March-2022
  DrmLookUpsGetByLookUpsTypeId(id) {
    let params = new HttpParams().set("Id", id);
    return this.http
      .get(this.apiUrl + "DrmLookUps/GetByLookUpsTypeId", {
        headers: this.headers,
        params: params,
      })
      .toPromise();
  }
  //==========================================================5 March-2022
  FinancialYearIdByCompanyId(data) {
    return this.http
      .post<any>(this.apiUrl + "FinancialYear/ReadActiveByOrganizationIdNCompanyId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //==========================================================9 March-2022
  ReadPendingIventoryApprovals(data) {
    return this.http
      .post<any>(this.apiUrl + "Dashboard/InventoryPendingApprovals", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  ReadPendingAccountsApprovals(data) {
    return this.http
      .post<any>(this.apiUrl + "Dashboard/AccountsPendingApprovals", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GetCompaniesList(data) {
    return this.http
      .post<any>(this.apiUrl + "Company/GetAll", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //===========================================10 March-2022
  FetchOrganizatinalApprovalDashboardData(data) {
    return this.http
      .post<any>(this.apiUrl + "OrganizationLevelDashboard/OrgGroup_ApprovalDashBoards", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //===========================================11 March-2022
  SupplierCustomerInfo(data) {
    return this.http
      .post<any>(this.apiUrl + "SupplierCustomer/SupplierCustomerRegister", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //==========================================21 March-2022
  GetVoucherHeadId(data) {
    return this.http
      .post<any>(this.apiUrl + "Voucher/GetVoucherHeadIdByDocumentTypeIdandRefDocNoId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //===========================================================01 April-2022
  GenerateVoucherCodeByDocumentTypeId(data) {
    return this.http
      .post<any>(this.apiUrl + "Voucher/GenerateVoucherCodeByDocumentTypeId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GetOutstandingChequeNoListByBankId(data) {
    return this.http
      .post<any>(this.apiUrl + "CheqBookHeader/OutstandingCheqNo", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //===========================================================5 April-2022
  GetItemsByItemTypeId(data) {
    return this.http
      .post<any>(this.apiUrl + "Item/GetItemByItemTypeId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //==========================================================7 April-2022
  GetAllOrderCategories() {
    return this.http
      .get<any>(this.apiUrl + "InvOrderCategory/GetAll", {
        headers: this.headers,
      })
      .toPromise();
  }
}
