import { CommonServices } from "./common-services";
import { Component, HostListener, Injectable, OnInit, ViewChild } from "@angular/core";
import DataSource from "devextreme/data/data_source";

@Injectable({
  providedIn: "root",
})
export class CommonMethodsForCombos {
  configurationList = [];
  constructor(private service: CommonServices) {}

  async ParentFromInventoryStocksEvaluations() {
    return await this.service.GetPaddyRiceParentCategories({ OrganizationId: sessionStorage.getItem("OrganizationId"), CompanyId: sessionStorage.getItem("CompanyId") });
  }

  async DocumentTypeFromInventoryStocksEvaluations() {
    return await this.service.DocumentTypeFromInventoryStocksEvaluations({ OrganizationId: sessionStorage.getItem("OrganizationId"), CompanyId: sessionStorage.getItem("CompanyId") });
  }

  async SupplierCustomerFromInventoryStocksEvaluations() {
    return await this.service.SupplierCustomerFromInventoryStocksEvaluations({ OrganizationId: sessionStorage.getItem("OrganizationId"), CompanyId: sessionStorage.getItem("CompanyId") });
  }
  async WarehouseFromInventoryStocksEvaluations() {
    return await this.service.WarehouseFromInventoryStocksEvaluations({ OrganizationId: sessionStorage.getItem("OrganizationId"), CompanyId: sessionStorage.getItem("CompanyId") });
  }
  async JobLotFromInventoryStocksEvaluations() {
    return await this.service.JobLotFromInventoryStocksEvaluations({ OrganizationId: sessionStorage.getItem("OrganizationId"), CompanyId: sessionStorage.getItem("CompanyId") });
  }
  async CropYear() {
    return await this.service.CropYear({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
    });
  }
  async ItemsFromInventoryStocksEvaluations() {
    return await this.service.ItemsFromInventoryStocksEvaluations({ OrganizationId: sessionStorage.getItem("OrganizationId"), CompanyId: sessionStorage.getItem("CompanyId") });
  }

  async CoaAllocationGetAll() {
    return await this.service.CoaAllocationGetAll({ OrganizationId: sessionStorage.getItem("OrganizationId"), CompanyId: sessionStorage.getItem("CompanyId") });
  }

  async CoaAllocationGetByCompanyId(CompanyId: number) {
    return await this.service.CoaAllocationGetAll({ OrganizationId: sessionStorage.getItem("OrganizationId"), CompanyId: CompanyId });
  }

  async GetAvailableTransactionsForIssuance(data) {
    return await this.service.GetAvailableTransactionsForIssuance({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      FromDate: data.FromDate,
      ToDate: data.ToDate,
      SupplierCustomerId: data.SupplierCustomerId,
      WarehouseId: data.WarehouseId,
      ItemId: data.ItemId,
      RefDocumentTypeId: data.RefDocumentTypeId,
      JobLotId: data.JobLotId,
      InventoryParentCategories: data.InventoryParentCategories,
      CropYear: data.CropYear,
    });
  }
  //#region Configurations
  async GetAllConfigurations() {
    return await this.service.configurations({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
    });
  }

  async CheckConfiguration(configurationName, firstCall) {
    if (firstCall == true) {
      this.configurationList = await this.GetAllConfigurations();
    }

    for (let { ConfigDescription, ConfigKey } of this.configurationList) {
      if (ConfigDescription == configurationName) {
        if (ConfigKey == "True") {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  //#endregion
  async GetAllPackingTypes() {
    return await this.service.getPackingType();
  }
  async GetAllCoaAllocations() {
    return await this.service.getCOAAllocation({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
    });
  }
  async GetItemsForComboBind() {
    return await this.service.getItemsForComboBind({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
    });
  }

  //================================================================01-Dec-2021
  async SupplierCustomerGetAll() {
    return await this.service.SupplierCustomerGetAll({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }

  async PaymentTermsGetAll() {
    return await this.service.PaymentTermsGetAll({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }
  async GetInventoryOtherItems() {
    return await this.service.getInventoryOtherItems({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }
  //#region Export

  async GetItemsForExport() {
    return await this.service.getItemsForExport({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
    });
  }
  async getWareHouse() {
    return await this.service.getWareHouse({
      CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
      OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
    });
  }
  async getJobLot() {
    return await this.service.getJobLot({
      CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
      OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
    });
  }

  async getUOM(e) {
    return await this.service.getUOM({
      CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
      OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
      ItemId: e,
    });
  }
  async SupplierCustomerForExport() {
    return await this.service.SupplierCustomerForExport({
      CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
      OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
    });
  }
  async ShippingLineNClearingAgentForExport() {
    return await this.service.ShippingLineNClearingAgentForExport({
      CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
      OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
    });
  }
  async DeliveryTermExport() {
    return await this.service.DeliveryTermExport({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }

  async PaymentTermForExport() {
    return await this.service.LcPaymentTerm({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }

  async SeaPortsForExport() {
    return await this.service.SeaPorts({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }

  async MultiCurrency() {
    return await this.service.MultiCurrency({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }
  async BankGetAll() {
    return await this.service.BankGetAll({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }
  async PackingTypeExportGetAll() {
    return await this.service.PackingTypeExportGetAll({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }

  async ExportShippinglineNClearingAgents() {
    return await this.service.ExportShippinglineNClearingAgents({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }
  async ReadAllForItemsForServices() {
    return await this.service.ReadAllForItemsForServices({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }

  async GetInvoiceNo(supplierCustomerId: number) {
    return await this.service.GetInvoiceNo({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      SupplierCustomerId: supplierCustomerId,
    });
  }
  async TaxesTypeGetForComboBind(type: number) {
    return await this.service.TaxesTypeGetForComboBind({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      Type: type,
    });
  }

  async GetTaxScheduleMain(taxId: number, effectedDate: Date) {
    return await this.service.GetTaxScheduleMain({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      TaxNameId: taxId,
      EffectedDate: effectedDate,
    });
  }
  async ExImInvoiceGetByOrganizationCompany(id: number) {
    return await this.service.ExImInvoiceGetByOrganizationCompany({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      Id: id,
    });
  }
  //#endregion
  //#region InventoryGeneric

  async GetSupplierCustomer(CustomerGroupId = null) {
    return await this.service.GetSupplierCustomer({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CustomerGroupId: CustomerGroupId,
    });
  }
  async GetCountry() {
    return await this.service.GetCountry({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }
  async GetByInvLookUpTypeId(InvLookupTypeId: number) {
    return await this.service.GetByInvLookUpTypeId({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      InvLookupTypeId: InvLookupTypeId,
    });
  }
  //#endregion

  async ItemTypesGetAll() {
    return await this.service.ItemTypesGetAll({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }
  async ItemCategoriesGetAll() {
    return await this.service.ItemCategoriesGetAll({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }
  async ItemClassGetAll() {
    return await this.service.ItemClassGetAll({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }
  async ItemsGetAll() {
    return await this.service.ItemsGetAll({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }
  async SupplierCustomerByOrganizationAndCompany() {
    return await this.service.SupplierCustomerByOrganizationAndCompany({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }
  async ExImGetLcOrderNo() {
    return await this.service.ExImGetLcOrderNo({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }
  //
  //============================================= 1 Jan 2022
  async GetInventoryDefaultsFromConfiguration() {
    return await this.service.GetInventoryDefaultsFromConfiguration({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }
  async VehicleTypeGetAll() {
    return await this.service.VehicleTypeGetAll({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }
  async CityGetByOrganizationAndCompany() {
    return await this.service.CityGetByOrganizationAndCompany({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }
  //------------------------------------------- 5 Jan 2022
  async ItemsFromItemPricingSchedule(branchesId, PriceTypeId) {
    return await this.service.ItemsFromItemPricingSchedule({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      BranchesId: branchesId,
      Id: PriceTypeId,
    });
  }
  // This method will create DataSouce type store for combos
  async GenerateSupplierCustomerDataSourceForComboBind() {
    let list = await this.service.SupplierCustomerGetAll({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
    if (list == null || list == undefined || list.length > 0 == false) {
      list = [];
    }
    let data = new DataSource({
      store: list,
      loadMode: "raw",
      paginate: true,
      pageSize: 10,
    });
    return data;
  }
  async GenerateItemDataSourceForComboBind() {
    let list = await this.service.getItemsForComboBind({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
    });
    if (list == null || list == undefined || list.length > 0 == false) {
      list = [];
    }
    let data = new DataSource({
      store: list,
      loadMode: "raw",
      paginate: true,
      pageSize: 10,
    });
    return data;
  }
  ///GenericList

  async GenerateDataSourceFromList(targetlist) {
    let list = targetlist;
    if (list == null || list == undefined || list.length > 0 == false) {
      list = [];
    }
    let data = new DataSource({
      store: list,
      loadMode: "raw",
      paginate: true,
      pageSize: 10,
    });
    return data;
  }
  //============================6 Jan 2022
  async UserAccountGetByOrganizationAndCompanyId() {
    let data = await this.service.UserAccountGetByOrganizationAndCompanyId({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
    let UserId = parseInt(sessionStorage.getItem("UserId"));
    return data.filter(({ ID }) => ID == UserId);
  }
  async GetStaticColumnNamesByActivity(activity) {
    return await this.service.StaticColumnNames({
      Activity: activity,
    });
  }
  async GenerateSalesManDataSource() {
    let list = await this.service.GetSalesManForSupplierustomer({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
    });
    if (list == null || list == undefined || list.length > 0 == false) {
      list = [];
    }

    let data = new DataSource({
      store: list,
      loadMode: "raw",
      paginate: true,
      pageSize: 10,
    });
    return data;
  }
  //================================================10 Jn 2022=====================================
  async GetAvailableStockInQuantity(toDate: Date, itemId: number, warehouseId = null, jobLotId = null) {
    return await this.service.GetAvailableStockInQuantity({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      ToDate: toDate,
      ItemId: itemId,
      WarehouseId: warehouseId,
      JobLotId: jobLotId,
    });
  }
  async GetAverageRateAgainstQuantity(toDate: Date, itemId: number, warehouseId, jobLotId = null) {
    return await this.service.GetAverageRateAgainstAvailableQuanity({
      CompanyId: sessionStorage.getItem("CompanyId"),
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      DocDate: toDate,
      ItemId: itemId,
      WarehouseId: warehouseId,
      JobLotId: jobLotId,
    });
  }
  //======================================================================12 Jan 2022
  async CoaAllocationGetAllList() {
    return await this.service.CoaAllocationGetAllList({
      CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
      OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
    });
  }
  //=====================================================================18 Jan 2022
  async GenerateStoreForLookUpColumn(data) {
    return {
      paginate: true,
      pageSize: 10,
      store: data,
    };
  }
  //=====================================================================20 Jan 2022
  async GetConfigurationByOrgCompandConfigDescription(configName) {
    return await this.service.GetConfigurationByOrgCompandConfigDescription({
      CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
      OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
      ConfigDescription: configName,
    });
  }
  async GetLcPurchaseOrderList(docTypeId) {
    return await this.service.GetLcPurchaseOrderList({
      CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
      OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
      DocumentTypeId: docTypeId,
    });
  }
  async InventoryParentCategories() {
    return await this.service.InventoryParentCategories({
      Activity: "InventoryParentCategories",
    });
  }
  async GetConfigKeyAndIdByConfigName(configName) {
    let ConfigObject: ConfigObjectType = new ConfigObjectType();

    ConfigObject = await this.service.GetConfigKeyAndIdByConfigName({
      ConfigName: configName,
      OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
      CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
    });

    if (ConfigObject == null || ConfigObject == undefined) {
      ConfigObject = new ConfigObjectType();
      ConfigObject.ConfigrationsDefinitionId = await this.service.GetConfigIdForFirstTime(configName);
    }
    return ConfigObject;
  }
  //============================================08-Feb-2022
  async DashboardDynamicObjects(objectName) {
    return await this.service.DashboardDynamicObjects({
      OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
      DashboardObjectName: objectName,
    });
  }
  async AccountsDashboard(FromDate, ToDate) {
    return await this.service.AccountsDashboard({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
      FromDate: FromDate,
      ToDate: ToDate,
      ActivityId: 1,
    });
  }
  async OrgGroup_AccountsDashboard(CompanyId, FromDate, ToDate, ExchangeRate, ActivityId: number, ActivityDescription?: string) {
    return await this.service.OrgGroup_AccountsDashboard({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: CompanyId,
      FinancialYearId: null,
      FromDate: FromDate,
      ToDate: ToDate,
      ActivityId: ActivityId,
      FcyRate: ExchangeRate,
      ReqType: ActivityDescription,
    });
  }
  //==========================================10 Feb 2022
  async GetSupplierCustomerFromImInvoice() {
    return await this.service.GetSupplierCustomerFromImInvoice({
      CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
      OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
    });
  }
  async GetSupplierCustomerFromImContract() {
    return await this.service.GetSupplierCustomerFromImContract({
      CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
      OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
    });
  }
  async GetAccountsIncludingAccountTypeIds(typeIds: string) {
    return await this.service.GetAccountsByAccountTypeIds({
      CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
      OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
      AccountTypeIds: typeIds,
      AccountTypeIdsNot: null,
    });
  }
  async GetAccountsExcludingAccountTypeIds(typeIds: string) {
    return await this.service.GetAccountsByAccountTypeIds({
      CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
      OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
      AccountTypeIds: null,
      AccountTypeIdsNot: typeIds,
    });
  }
  async SupplierGroupGetAll() {
    return await this.service.SupplierGroupGetAll({ OrganizationId: sessionStorage.getItem("OrganizationId"), CompanyId: sessionStorage.getItem("CompanyId") });
  }
  //==================================================================== 14 Feb-2022
  async UserRightsByScreenName(Screen: string) {
    return await this.service.UserRightsByScreenName({
      UserId: sessionStorage.getItem("UserId"),
      ScreenName: Screen,
      RightName: sessionStorage.getItem("RoleName"),
    });
  }
  async GetUserRightByUserIdAndModuleName(module: string) {
    return await this.service.GetUserRightByUserIdAndModuleName({
      UserId: sessionStorage.getItem("UserId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      ModuleDescription: module,
      RightName: sessionStorage.getItem("RoleName"),
    });
  }
  async GetDetailAccountByDocumentTypeId(docTypeId: number) {
    return await this.service.GetDetailAccountByDocumentTypeId({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      DocumentTypeId: docTypeId,
    });
  }
  async ReadBalanceBySelectedAccount(VoucherDate, AccountId: number) {
    return await this.service.ReadBalanceBySelectedAccount({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      FinancialYearId: sessionStorage.getItem("FinancialYearId"),
      VoucherDate: VoucherDate,
      RefAccountId: AccountId,
    });
  }
  //==========================================================16 Feb-2022
  async GetAllProvinces() {
    return await this.service.GetAllProvinces({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
    });
  }
  //========================================================= 19 Feb-2022
  async GetEqvilentByItemId(ItemId: number) {
    return await this.service.GetEqvilentByItemId({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      ItemId: ItemId,
    });
  }
  //=======================================================20 Feb-2022
  async AccountsTypesGetAll() {
    return await this.service.AccountsTypesGetAll({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
    });
  }
  async GetAllUomsByOrganizationCompany() {
    return await this.service.GetAllUomsByOrganizationCompany({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
    });
  }
  //=======================================================25 Feb-2022
  async CompanyGetById(Id) {
    return await this.service.ComanyGetById(Id);
  }
  //=======================================================03 March-2022
  async DrmLookUpsGetByLookUpsTypeId(data) {
    return await this.service.DrmLookUpsGetByLookUpsTypeId(data);
  }
  //=======================================================05 March-2022
  async FinancialYearIdByCompanyId(CompanyId: number | string) {
    return await this.service.FinancialYearIdByCompanyId({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: CompanyId,
    });
  }
  //=======================================================9 March-2022
  async ReadPendingIventoryApprovals(CompanyId: number) {
    return await this.service.ReadPendingIventoryApprovals({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: CompanyId,
    });
  }
  async ReadPendingAccountsApprovals(CompanyId: number, FinancialYearId: number) {
    return await this.service.ReadPendingAccountsApprovals({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: CompanyId,
      FinancialYearId: FinancialYearId,
    });
  }
  async GetCompaniesList() {
    return await this.service.GetCompaniesList({
      OrgCompanyTypeId: sessionStorage.getItem("OrganizationId"),
    });
  }
  //==================================================10 March-2022
  async FetchOrganizatinalApprovalDashboardData() {
    return await this.service.FetchOrganizatinalApprovalDashboardData({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
    });
  }
  //=================================================11 March-2022
  async GetSupplierCustomerInfo(CompanyId: number, SupplierCustomerId?: number, CountryId?: number, CityId?: number, AccountId?: number) {
    return await this.service.SupplierCustomerInfo({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: CompanyId,
      SupplierCustomerId: SupplierCustomerId,
      CountryId: CountryId,
      CityId: CityId,
      AccountId: AccountId,
    });
  }
  async GetVoucherHeadId(DocumentTypeId: number, DocumentId: number) {
    return await this.service.GetVoucherHeadId({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      DocumentTypeId: DocumentTypeId,
      DocumentTypeSrNo: DocumentId,
    });
  }
  //============================================================== 01 April-2022
  async GenerateVoucherCodeByDocumentTypeId(DocumentTypeId: number) {
    let data = await this.service.GenerateVoucherCodeByDocumentTypeId({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      FinancialYearId: sessionStorage.getItem("FinancialYearId"),
      DocumentTypeId: DocumentTypeId,
    });
    return data[0];
  }

  async GetOutstandingChequeNoListByBankId(BankId: number) {
    return await this.service.GetOutstandingChequeNoListByBankId({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      BankId: BankId,
    });
  }
  //==================================================05 April-2022
  async SetDefaultValues() {
    let Defaults: InventoryDefaultsModel = new InventoryDefaultsModel();
    let ConfigurationsList = await this.GetAllConfigurations();
    if (ConfigurationsList != null && ConfigurationsList != undefined) {
      if (ConfigurationsList.length > 0) {
        ConfigurationsList.map((item) => {
          if (item.ConfigDescription == "Default Crop Year" && item.ConfigKey > 0) {
            Defaults.DefaultCropYear = item.ConfigKey;
          } else if (item.ConfigDescription == "Job/Lot" && item.ConfigKey > 0) {
            Defaults.DefaultJobLot = item.ConfigKey;
          } else if (item.ConfigDescription == "Paking Type" && item.ConfigKey > 0) {
            Defaults.DefaultPackingType = item.ConfigKey;
          } else if (item.ConfigDescription == "Warehouse" && item.ConfigKey > 0) {
            Defaults.DefaultWarehouse = item.ConfigKey;
          } else if (item.ConfigDescription == "City Area" && item.ConfigKey > 0) {
            Defaults.DefaultCityArea = item.ConfigKey;
          }
        });
      }
    }
    return Defaults;
  }
  async GetItemsByItemTypeIds(ItemTypeIds: string) {
    return await this.service.GetItemsByItemTypeId({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      Ids: ItemTypeIds,
    });
  }

  //=====================================================================
  async GetAllOrderCategories() {
    return await this.service.GetAllOrderCategories();
  }
}
export class InventoryDefaultsModel {
  DefaultCropYear: number;
  DefaultJobLot: number;
  DefaultPackingType: number;
  DefaultWarehouse: number;
  DefaultCityArea: number;
}
class ConfigObjectType {
  ConfigrationsDefinitionId: number;
  Id: number;
  CompanyId: number;
  OrganizationId: number;
  ConfigDescription: number;
  ConfigKey: string;
  ConfigModuleDescription: string;
  ConfigValue: any;
  IsActive: boolean;
}
