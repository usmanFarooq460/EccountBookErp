import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { validate } from "src/app/shared/Base/validationHelper";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { GatePassInwardService } from "../gate-pass-inward.service";
import { gatePassInwardModel } from "../gate-pass-inward.model";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { PdfReportsCommonMethods } from "src/app/shared/base/pdf-reports-common-methods";
@Component({
  selector: "app-gate-pass-inward-form",
  templateUrl: "./gate-pass-inward-form.component.html",
  styleUrls: ["../gate-pass-inward.scss"],
})
export class GatePassInwardFormComponent extends BaseActions implements OnInit {
  @ViewChild("gatePassInwardGrid", { static: false })
  gatePassInwardGrid: DxDataGridComponent;
  @ViewChild("GatePassInwardForm1", { static: false })
  GatePassInwardForm1: DxFormComponent;
  @ViewChild("GatePassInwardForm2", { static: false })
  GatePassInwardForm2: DxFormComponent;
  @ViewChild("GatePassInwardForm3", { static: false })
  GatePassInwardForm3: DxFormComponent;
  @ViewChild("SuppCustDetailUnderComboComponent", { static: false })
  SuppCustDetailUnderComboComponent;
  GatePassInwardFormData: gatePassInwardModel;
  supplierList: any;
  gpTypeList = [];
  dataSource = [];
  ContainerListByimport = [];
  configurationsList = [];
  DataSourceOpenStatus = [];
  quantityOnBaseOfPurchaseOrder = [];
  statusList = [{ name: "Open" }, { name: "Accepted" }, { name: "Rejected" }];
  orderTypeList = [];
  //=================================================
  SaleOrderListForLoader = [];
  PopupPageSize: any;
  LoaderpopupVisible: boolean = false;
  OutstandingSupplyOrderData = [];
  SupplierCusomterData = [];
  ListOfDataAgainstEnteredSupplyOrderNo = [];
  PopupGridPageSize: any;
  weighBridgeTypeReadOnly: boolean = false;
  //=========================================================
  //=========================================================
  PoCumpulsory: boolean;
  OpenOrderQuantity: boolean;
  //=========================================================

  GatePassParamsId: number;
  warehouseList: any;
  ItemsList: any;
  VehicleTypeList: any;
  CityList: any;
  inTime: Date;
  weightBridgeStatusList = [{ name: "Manual" }, { name: "Auto" }];
  //
  totalQtyByPurchaseOrder: number;
  weighBridgeSlipNo: number;
  showContainers = false;
  labDetailObject = {
    AnalystName: "",
    LabReportNo: "",
    LabStatus: "",
    LabRemarks: "",
  };
  //======================================================
  WbCompulsoryForGpInwardConfigurationStatus: boolean = false;
  RecordToBeCompared: any;
  ValueHasBeenComparedOnce: boolean = false;
  //======================================================
  constructor(
    private commonService: CommonBaseService,
    private service: GatePassInwardService,
    private route: ActivatedRoute,
    private router: Router,
    private commonMethods: CommonMethodsForCombos,
    private pdfReportsCommonMethods: PdfReportsCommonMethods
  ) {
    super();
  }
  async ngOnInit() {
    this.GatePassParamsId = this.route.snapshot.queryParams["Id"];
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("InwardGatePass"));
    this.FetchData();
    this.initForm();
    this.DataSourceOpenStatusGetByGpDate();
    let WeighBridgeCompulsoryStatus = await this.commonMethods.GetConfigurationByOrgCompandConfigDescription("WbCompulsoryForGpInward");
    WeighBridgeCompulsoryStatus === "True" ? (this.WbCompulsoryForGpInwardConfigurationStatus = true) : (this.WbCompulsoryForGpInwardConfigurationStatus = false);
  }

  async FetchData() {
    this.configurationsList = await this.commonMethods.GetAllConfigurations().catch((err) => this.HandleError(err));
    this.VehicleTypeList = await this.commonMethods.VehicleTypeGetAll().catch((err) => this.HandleError(err));
    this.ItemsList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetItemsForComboBind());
    this.warehouseList = await this.commonMethods.getWareHouse();
    this.CityList = await this.commonMethods.CityGetByOrganizationAndCompany();
    this.gpTypeList = await this.GpTypeGetAll();
    this.orderTypeList = await this.GetOrderTypeConditionally();
  }

  async initForm() {
    this.GatePassInwardFormData = new gatePassInwardModel();
    this.GatePassInwardFormData.GpDate = new Date();
    this.weighBridgeTypeReadOnly = false;
    this.GatePassInwardFormData.DocAttachment = this.weightBridgeStatusList[1].name;
    if (this.GatePassParamsId > 0 === false) {
      this.GatePassInwardFormData.GpSrNo = await this.GenerateCode();
      this.GatePassInwardFormData.InDateTimeStamp = new Date();
      this.GatePassInwardFormData.Status = this.statusList[0].name;
    } else {
      this.setFields4editMode();
      this.GatePassInwardFormData.OutDateTimeStamp = new Date();
      this.GatePassInwardFormData.Status = this.statusList[1].name;
    }
  }

  onEdit = (e) => {
    this.initForm();
    this.GatePassParamsId = e.Id;
    this.setFields4editMode();
    for (let i = 0; i < this.CityList.length; i++) {
      if (e.CityName == this.CityList[i].CityName) {
        this.GatePassInwardFormData.CityId = this.CityList[i].Id;
      }
    }
    for (let i = 0; i < this.warehouseList.length; i++) {
      if (e.WareHouseName == this.warehouseList[i].WareHouseName) {
        this.GatePassInwardFormData.WarehouseId = this.warehouseList[i].Id;
      }
    }
    this.GetWBNetWeight(e.Id);
    for (let { ConfigDescription, ConfigKey } of this.configurationsList) {
      if (ConfigDescription == "LabCompulsoryForWeighBridge") {
        if (ConfigKey == "True") {
          this.GetLabDataAgainstGpId(e.Id);
        }
      }
    }
  };

  async GenerateCode() {
    return await this.service.GenerateCode({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      DocumentTypeId: 51,
    });
  }

  async GetOrderTypeConditionally() {
    return await this.service
      .GetOrderType({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .catch((err) => this.HandleError(err));
  }

  setFields4editMode() {
    this.ActivateLoadPanel("Fetching Data");
    if (this.GatePassParamsId) {
      this.service.GatepassGetById(this.GatePassParamsId).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.GatePassInwardFormData = result;
          // this.GatePassInwardFormData.Status = this.statusList[1].name;
          let supplierList = [];
          supplierList.push({
            Id: result.SupplierCustomerId,
            CompanyName: result.SupplierName,
          });
          this.GenerateSupplierDataSource(supplierList);
          this.RecordToBeCompared = JSON.parse(JSON.stringify(result));
          //======================
          this.inTime = result.InDateTimeStamp;
          this.GatePassInwardFormData.OutDateTimeStamp = new Date();
          this.GetWBNetWeight(this.GatePassParamsId);
          for (let { ConfigDescription, ConfigKey } of this.configurationsList) {
            if (ConfigDescription == "LabCompulsoryForWeighBridge") {
              if (ConfigKey == "True") {
                this.GetLabDataAgainstGpId(this.GatePassParamsId);
              }
            }
          }
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
    } else {
      this.DeActivateLoadPanel();
      this.GatePassParamsId = null;
    }
  }

  handleCustomerIdChange = (e) => {
    this.SuppCustDetailUnderComboComponent.SetInfoObjectValues(e.value);
  };

  async GenerateSupplierDataSource(List) {
    this.supplierList = await this.commonMethods.GenerateDataSourceFromList(List);
  }

  GetWBNetWeight(e) {
    this.service
      .GetNetWeightFromWbTransactions({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ReferenceDocTypeId: 51,
        ReferenceDocNoId: e,
      })
      .subscribe(
        (result) => {
          if (result?.length > 0) {
            result.map((item) => {
              this.GatePassInwardFormData.WeighBridgeId = item.Id;
              this.GatePassInwardFormData.FactoryWeight = item.NetWbWeight;
              this.weighBridgeSlipNo = item.TicketNo;
              if (item.NetWbWeight > 0) {
                this.weighBridgeTypeReadOnly = true;
              }
            });
          }
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  GetLabDataAgainstGpId(e) {
    this.service
      .GetDataFromLabAgainstGpId({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        Id: e,
      })
      .subscribe(
        (result) => {
          if (result.length > 0) {
            this.labDetailObject.AnalystName = result[0].AnalystName;
            this.labDetailObject.LabReportNo = result[0].DocNo;
            this.labDetailObject.LabStatus = result[0].LabStatus;
            this.labDetailObject.LabRemarks = result[0].RemarksHeader;
          }
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  handlediffweight = (e) => {
    if (this.GatePassInwardFormData.SupplierWeight && this.GatePassInwardFormData.FactoryWeight) {
      this.GatePassInwardFormData.DifferenceWeight = this.GatePassInwardFormData.SupplierWeight - this.GatePassInwardFormData.FactoryWeight;
    } else {
      this.GatePassInwardFormData.DifferenceWeight = null;
    }
  };

  async GpTypeGetAll() {
    return await this.service.GpTypeGetAll();
  }

  GpTypeLeave = (e) => {
    if (e.value) {
      if (this.GatePassInwardFormData.GatepassType == "Export" || this.GatePassInwardFormData.GatepassType == "Export Return" || this.GatePassInwardFormData.GatepassType == "Import") {
        this.showContainers = true;
      } else this.showContainers = false;
      this.service
        .GenerateGpTypeCode({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          GatepassType: e.value,
        })
        .subscribe(
          (result) => {
            this.GatePassInwardFormData.GpTypeSrNo = result;
          },
          (error) => {
            this.HandleError(error);
          }
        );
    }
  };
  async CustomerAccount(SupplierId) {
    this.SupplierCusomterData = await this.commonMethods.SupplierCustomerByOrganizationAndCompany().catch((err) => this.HandleError(err));
    this.supplierList = await this.commonMethods.GenerateDataSourceFromList(this.SupplierCusomterData);
    if (SupplierId > 0) {
      this.supplierList = await this.commonMethods.GenerateDataSourceFromList(this.SupplierCusomterData.filter((item) => item.Id == SupplierId));
    }
  }

  DataSourceOpenStatusGetByGpDate() {
    this.service
      .GatePassGetByGpDate({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        DocumentTypeId: 51,
        DocDate: this.GatePassInwardFormData.GpDate,
      })
      .subscribe(
        (result) => {
          this.DataSourceOpenStatus = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  resetForm() {
    this.router.navigate([], { queryParams: { Id: null } });
    this.GatePassParamsId = null;
    this.initForm();
  }

  GetAllOutstandingSupplyOrder(DocNo) {
    if (this.GatePassParamsId > 0 == false) {
      this.service
        .OutstandingSupplyOrder({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          Id: DocNo,
        })
        .subscribe(
          (result) => {
            if (result.length > 0) {
              this.OutstandingSupplyOrderData = result;
            } else {
              this.WarningPopup("This Order No is either Incorrect or is Not Approved or it has already been Refered in GP.");
              return;
            }
          },
          (error) => {
            this.HandleError(error);
          }
        );
    }
  }

  OrderNoLeave = (e) => {
    if (e.value == null || e.value == undefined || e.value == "") return;
    if (this.GatePassParamsId > 0 && e.value == this.RecordToBeCompared.SupplierContractCode && this.ValueHasBeenComparedOnce == false) {
      this.ValueHasBeenComparedOnce = true;
      return;
    }
    if (this.GatePassInwardFormData.GatepassType == "" || this.GatePassInwardFormData.GatepassType == null) {
      this.WarningPopup("Select GatePass Type First!");
      this.GatePassInwardFormData.SupplierContractCode = null;
      this.GatePassInwardForm1.instance.getEditor("GatepassType").focus();
      return;
    } else if (this.GatePassInwardFormData.OtherSupCust == "" || this.GatePassInwardFormData.OtherSupCust == null) {
      this.WarningPopup("Please Select Order Type First!");
      this.GatePassInwardFormData.SupplierContractCode = null;
      this.GatePassInwardForm1.instance.getEditor("OtherSupCust").focus();
      return;
    } else if (this.GatePassInwardFormData.OtherSupCust == "Supply Order") {
      this.GetAllOutstandingSupplyOrder(e.value);
    } else if (this.GatePassInwardFormData.OtherSupCust == "Purchase Order" || this.GatePassInwardFormData.OtherSupCust == "Import Order") {
      this.checkConfigurationForPoCompulsory();
      if (this.PoCumpulsory == true) {
        this.getSupplierAndBalanceQtyByPoNumberIfConfigurationIsTrue();
      } else if (this.PoCumpulsory == false) {
        this.CustomerAccount(0);
      }
    }
  };

  checkConfigurationForPoCompulsory() {
    for (let { ConfigDescription, ConfigKey } of this.configurationsList) {
      if (ConfigDescription === "PO Compulsory in GPI") {
        if (ConfigKey == "True") {
          this.PoCumpulsory = true;
        } else {
          this.PoCumpulsory = false;
        }
      }
      if (ConfigDescription === "Open Order Quantity") {
        if (ConfigKey == "True") {
          this.OpenOrderQuantity = true;
        } else {
          this.OpenOrderQuantity = false;
        }
      }
    }
  }
  getSupplierAndBalanceQtyByPoNumberIfConfigurationIsTrue() {
    if (this.GatePassInwardFormData.GatepassType != "Import") {
      this.service
        .GetSupplierByPurchaseOrderNo({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          DocumentTypeId: 41,
          OrderId: this.GatePassInwardFormData.SupplierContractCode,
        })
        .subscribe(
          (result) => {
            if (result?.length > 0 == false) {
              this.GatePassInwardFormData.SupplierContractCode = null;
              this.supplierList = [];
              this.WarningPopup("Purchase Order either don't exist or not Approved!");
              return;
            } else if (result?.length > 0) {
              this.supplierList = result;
              this.GatePassInwardFormData.PurchaseOrderId = this.supplierList[0].PurchaseOrderId;
              this.GatePassInwardFormData.SupplierCustomerId = this.supplierList[0].Id;
              this.GetTotolQuantityByPurchaseOrderId(this.supplierList[0].PurchaseOrderId);
              this.GatePassInwardFormData.VarietyName = this.supplierList[0].ItemName;
            }
          },
          (error) => {
            this.HandleError(error);
          }
        );
    } else if (this.GatePassInwardFormData.GatepassType == "Import") {
      this.service
        .GetSupplierByImportPurchaseContract({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          DocumentTypeId: 232,
          InvoiceNo: this.GatePassInwardFormData.SupplierContractCode,
        })
        .subscribe(
          (result) => {
            if (result != null && result != undefined) {
              if (result.length > 0 == false) {
                this.GatePassInwardFormData.SupplierContractCode = null;
                this.supplierList = [];
                this.WarningPopup("Purchase Order either don't exist or is not Open Status!");
                return;
              }
              this.supplierList = result;
              this.GatePassInwardFormData.PurchaseOrderId = this.supplierList[0].PurchaseOrderId;
              this.GatePassInwardFormData.SupplierCustomerId = this.supplierList[0].Id;
              this.GetContainerNo(this.supplierList[0].PurchaseOrderId);
            }
          },
          (error) => {
            this.HandleError(error);
          }
        );
    }
  }
  GetTotolQuantityByPurchaseOrderId(e) {
    this.service
      .TotalReceivedQuantityByPoId({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        PurchaseOrderId: e,
      })
      .subscribe(
        (result) => {
          this.totalQtyByPurchaseOrder = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  GetContainerNo(e) {
    this.service
      .GetContainerNoForImport({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 232,
        Id: e,
      })
      .subscribe(
        (result) => {
          this.ContainerListByimport = result;
          if (this.ContainerListByimport?.length > 0) {
            this.GatePassInwardFormData.Container = result[0].ContainerNo;
          }
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  onSave() {
    if (this.GatePassParamsId > 0) {
      if (this.UserRightsObject.canUpdate) {
        this.handleSave();
      } else {
        this.WarningPopup("You don't have right to Update!");
        return;
      }
    } else {
      if (this.UserRightsObject.canSave) {
        this.handleSave();
      } else {
        this.WarningPopup("You dont't have right to Save!");
        return;
      }
    }
  }

  async GatePassInward_Slip_251(data) {
    this.ActivateLoadPanel("Loading Report");
    this.OpenPdfReportInNewTab(await this.pdfReportsCommonMethods.GatePassInward_Slip_251(data.Id).catch((error) => this.HandleError(error)));
    this.DeActivateLoadPanel();
  }
  async GatePassInward_Import_Slip_802(data) {
    this.ActivateLoadPanel("Loading Report");
    this.OpenPdfReportInNewTab(await this.pdfReportsCommonMethods.GatePassInward_Import_Slip_802(data.Id).catch((error) => this.HandleError(error)));
    this.DeActivateLoadPanel();
  }

  handleSave() {
    if (validate(this.GatePassInwardForm3 && this.GatePassInwardForm2 && this.GatePassInwardForm1)) {
      let id = 0;
      this.GatePassParamsId ? (id = this.GatePassParamsId) : (id = null);
      this.GatePassInwardFormData.Id = id;
      if (this.GatePassInwardFormData.GatepassType == "Import") {
        if (this.GatePassInwardFormData.Container == "" && this.GatePassInwardFormData.Container1 == "") {
          this.WarningPopup("Please Select At least One Container No In Case of Import");
          this.GatePassInwardForm3.instance.getEditor("Container").focus();
          return;
        }
        if (this.GatePassInwardFormData.Container == null || this.GatePassInwardFormData.Container == "") {
          this.WarningPopup("Please Select Container No 1");
          this.GatePassInwardForm3.instance.getEditor("Container").focus();
          return;
        }
        if (this.GatePassInwardFormData.Container != null) {
          if (this.GatePassInwardFormData.Container == this.GatePassInwardFormData.Container1) {
            this.WarningPopup("Cannot Save With Same Container No Please Check");
            return;
          }
        }
      }

      if (this.GatePassInwardFormData.Status != "Open") {
        if (this.GatePassParamsId > 0) {
          if (this.GatePassInwardFormData.FactoryWeight == null || this.GatePassInwardFormData.FactoryWeight == undefined || this.GatePassInwardFormData.FactoryWeight > 0 == false) {
            this.WarningPopup("Factory Weight is Required");
            return;
          }
        }
      }
      if (this.GatePassInwardFormData.PurchaseOrderId > 0 == false) {
        this.WarningPopup("Purchase Order Id Not Found!");
        return;
      }
      this.GatePassInwardFormData.IsApproved = false;
      this.GatePassInwardFormData.PostState = false;
      this.GatePassInwardFormData.EntryDate = new Date();
      this.GatePassInwardFormData.ModifyDate = new Date();
      this.GatePassInwardFormData.PostDate = new Date();
      this.GatePassInwardFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.GatePassInwardFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.GatePassInwardFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.GatePassInwardFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.GatePassInwardFormData.PostUser = parseInt(sessionStorage.getItem("UserId"));
      this.GatePassInwardFormData.SupplierName = this.GatePassInwardForm2.instance.getEditor("SupplierCustomerId").option("text");
      this.GatePassInwardFormData.DocumentTypeId = 51;
      if (this.GatePassInwardFormData.OtherSupCust == "Supply Order") {
        this.GatePassInwardFormData.RefDocumentTypeId = 104;
      } else if (this.GatePassInwardFormData.OtherSupCust == "Purchase Order") {
        this.GatePassInwardFormData.RefDocumentTypeId = 41;
      }
      console.log("Form data Before usbmit", this.GatePassInwardFormData);
      this.GatePassParamsId > 0 ? this.ActivateLoadPanel("Updating") : this.ActivateLoadPanel("Saving");
      this.service.GatepassSave(this.GatePassInwardFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.GatePassParamsId ? this.SuccessPopup("Record updated successfully") : this.SuccessPopup("Record saved successfully!");
          this.MUST_PRINT_AFTER_SAVE ? this.GatePassInward_Slip_251(result) : "";
          this.resetForm();
          this.DataSourceOpenStatusGetByGpDate();
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
    }
  }

  DummyMethod() {}
  onToolbarPreparing = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("gatePassInwardGrid"), this.gatePassInwardGrid));
    this.FilterButtonInGridToolbar(e);
  };
}
