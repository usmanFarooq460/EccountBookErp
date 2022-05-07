import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { validate } from "src/app/shared/Base/validationHelper";
import { GatePassOutwardService } from "../gate-pass-outward.service";
import { gatePassOutwardModel } from "../gate-pass-outward.model";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "app-gate-pass-outward-form",
  templateUrl: "./gate-pass-outward-form.component.html",
  styleUrls: ["./gate-pass-outward-form.component.scss"],
})
export class GatePassOutwardFormComponent extends BaseActions implements OnInit {
  @ViewChild("gatePassOutwardFormComponentGrid", { static: false })
  gatePassOutwardFormComponentGrid: DxDataGridComponent;
  @ViewChild("GatePassOutwardForm1", { static: false })
  GatePassOutwardForm1: DxFormComponent;
  @ViewChild("GatePassOutwardForm2", { static: false })
  GatePassOutwardForm2: DxFormComponent;
  @ViewChild("GatePassOutwardForm3", { static: false })
  GatePassOutwardForm3: DxFormComponent;
  GatePassOutwardData: gatePassOutwardModel;
  @ViewChild("SuppCustDetailUnderComboComponent", { static: false })
  SuppCustDetailUnderComboComponent;
  supplierList: any;
  gpTypeList = [];
  configurations = [];
  InventoryDefaultList = [];
  weightBridgeTypeList = [{ type: "Mannual" }, { type: "Auto" }];
  statusList = [{ name: "Open" }, { name: "Accepted" }, { name: "Rejected" }];
  GatePassParamsId: number;
  warehouseList: any;
  ItemsList: any;
  VehicleTypeList: any;
  CityList: any;
  documentIdValue: number;
  SupplierDisabledStatus: boolean;
  gatepassbasedOnList = [{ name: "SaleOrder" }, { name: "DeliverOrder" }];
  SupplierWeightStatus: boolean;
  deliveryOrderId: number;
  canPrintonSave: boolean = true;
  GpOpenStatusList = [];
  containersVisible: boolean;

  constructor(private commonMethods: CommonMethodsForCombos, private service: GatePassOutwardService, private route: ActivatedRoute, private router: Router) {
    super();
  }
  async ngOnInit() {
    this.GatePassParamsId = this.route.snapshot.queryParams["Id"];
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("OutwardGatePass"));
    this.GpTypeGetAll();
    await this.FetchData();
    this.initForm();
  }

  async FetchData() {
    this.ActivateLoadPanel("Fetching Data For Form Fields");
    this.VehicleTypeList = await this.commonMethods.VehicleTypeGetAll().catch((err) => this.HandleError(err));
    this.ItemsList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetItemsForComboBind().catch((err) => this.HandleError(err)));
    this.warehouseList = await this.commonMethods.getWareHouse().catch((err) => this.HandleError(err));
    this.CityList = await this.commonMethods.CityGetByOrganizationAndCompany().catch((err) => this.HandleError(err));
    this.configurations = await this.commonMethods.GetAllConfigurations().catch((err) => this.HandleError(err));
    this.supplierList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.SupplierCustomerGetAll().catch((err) => this.HandleError(err)));
    this.InventoryDefaultList = await this.commonMethods.GetInventoryDefaultsFromConfiguration().catch((err) => this.HandleError(err));
    this.DeActivateLoadPanel();
  }
  initForm() {
    this.GatePassOutwardData = new gatePassOutwardModel();
    this.GatePassOutwardData.Status = this.statusList[0].name;
    this.GatePassOutwardData.DocAttachment = this.weightBridgeTypeList[1].type;
    this.GatePassOutwardData.GpDate = new Date();
    this.GatePassOutwardData.GatepassType = this.gpTypeList[0].GpTypeDescription;
    this.GatePassOutwardData.OtherSupCust = this.gatepassbasedOnList[1].name;
    if (this.GatePassParamsId > 0) {
      this.GatePassOutwardData.OutDateTimeStamp = new Date();
      this.setFields4editMode();
    } else {
      this.GatePassOutwardData.InDateTimeStamp = new Date();
      this.GenerateCode();
    }
    this.GpOpenStatus();
  }

  checkValidationForCustomerName = (e) => {
    if (this.GatePassOutwardData.OtherSupCust == "DeliverOrder") {
      return true;
    } else {
      if (this.GatePassOutwardData.SupplierCustomerId <= 0) {
        return false;
      } else if (this.GatePassOutwardData.SupplierCustomerId > 0) {
        return true;
      }
    }
  };

  handleCustomerIdChange = (e) => {
    this.SuppCustDetailUnderComboComponent.SetInfoObjectValues(e.value);
  };

  hanldeOrderTypeChange = (e) => {
    this.GatePassOutwardData.SupplierContractCode = null;
    this.GatePassOutwardData.SupplierWeight = null;
    this.GatePassOutwardData.SupplierCustomerId = null;
    this.GatePassOutwardData.DifferenceWeight = null;
  };

  GpOpenStatus() {
    this.service
      .GetHistoryonlystatusOpen({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        DocumentTypeId: 91,
      })
      .subscribe(
        (result) => {
          this.GpOpenStatusList = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  checkValidationForOutDateTime = (e) => {
    if (this.GatePassParamsId > 0 == false) {
      return true;
    } else if (this.GatePassParamsId > 0) {
      if ((e.value = null || e.value == "")) {
        return false;
      } else if (e.value != null || e.value != "") {
        return true;
      }
    }
  };
  checkValidationForFactoryWeight = (e) => {
    if (this.GatePassParamsId > 0 == false) {
      return true;
    } else if (this.GatePassParamsId > 0) {
      if (e.value != null && e.value > 0) {
        return true;
      } else if (e.value == null || e.value <= 0) {
        return false;
      }
    }
  };

  setFields4editMode() {
    if (this.GatePassParamsId) {
      this.GetDataById(this.GatePassParamsId);
    } else {
      this.GatePassParamsId = null;
    }
  }

  GetDataById(Id) {
    this.service.GatepassGetById(Id).subscribe(
      (result) => {
        this.GatePassOutwardData = result;
        this.GatePassOutwardData.OutDateTimeStamp = new Date();
        if (result.Status == "Open") {
          this.GatePassOutwardData.Status = this.statusList[1].name;
        }
        this.GetWBNetWeight();
      },
      (error) => {
        this.HandleError(error);
      }
    );
  }
  // This method sets the readOnly Property on Supplier Customer Name Field
  otherSupCustChange = (e) => {
    if (e.value == "SaleOrder") {
      this.SupplierDisabledStatus = false;
    } else {
      this.SupplierDisabledStatus = true;
    }
  };
  // This method is called when user click on edit button
  // This method is same as set Fields For Edit Mode
  onEdit = (e) => {
    this.GatePassParamsId = e.Id;
    this.GetDataById(this.GatePassParamsId);
    this.GetWBNetWeight();
  };

  GetWBNetWeight() {
    this.service
      .GetNetWeightFromWbTransactions({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        ReferenceDocTypeId: 91,
        ReferenceDocNoId: this.GatePassParamsId,
      })
      .subscribe(
        (result) => {
          result?.map((item) => {
            this.GatePassOutwardData.WeighBridgeId = item.Id;
            this.GatePassOutwardData.FactoryWeight = item.NetWbWeight;
          });
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  handleDiffWeight = (e) => {
    let factoryWeight = this.GatePassOutwardData.FactoryWeight != null || this.GatePassOutwardData.FactoryWeight != undefined ? this.GatePassOutwardData.FactoryWeight : 0;
    if (this.GatePassOutwardData.SupplierWeight) {
      this.GatePassOutwardData.DifferenceWeight = this.GatePassOutwardData.SupplierWeight - factoryWeight;
    }
  };

  GenerateCode() {
    this.service
      .GenerateCode({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.GatePassOutwardData.GpSrNo = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  GpTypeGetAll() {
    this.service.GpTypeGetAll().subscribe(
      (result) => {
        this.gpTypeList = result;
      },
      (error) => {
        this.HandleError(error);
      }
    );
  }
  // I am calling this method on leave of GpType so that every time it is changed user neet to enter Order # again:
  GpTypeLeave = (e) => {
    if (e.value == "Export" || e.value == "Export Return" || e.value == "Import") {
      this.containersVisible = true;
    } else {
      this.containersVisible = false;
    }
    if (this.GatePassParamsId > 0 == false) {
      this.GatePassOutwardData.SupplierContractCode = null;
    }
    this.GatePassOutwardForm1.instance.getEditor("SupplierContractCode").focus();
    if (e.value) {
      this.service
        .GenerateGpTypeCode({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          GatepassType: e.value,
        })
        .subscribe(
          (result) => {
            this.GatePassOutwardData.GpTypeSrNo = result;
          },
          (error) => {
            this.HandleError(error);
          }
        );
    }
  };
  resetForm() {
    this.GatePassParamsId = null;
    this.initForm();
    this.GatePassOutwardForm1.instance.getEditor("GatepassType").focus();
  }

  getweightByDeliveryOrderId(e) {
    this.service
      .GetTotalWeightFromDeliveryOrder({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        DocumentTypeId: 84,
        Id: e,
      })
      .subscribe(
        (result) => {
          let deliveryorderresult = [];
          deliveryorderresult = result;
          if (deliveryorderresult.length > 0) {
            if (result[0].DeliveryOrderType == "Export" && this.GatePassOutwardData.GatepassType != "Export") {
              this.GatePassOutwardData.SupplierContractCode = null;
              this.GatePassOutwardData.GatepassType = null;
              this.WarningPopup("Entered Order No is Against Export Type!");
              this.GatePassOutwardForm1.instance.getEditor("GatepassType").focus();
            } else {
              this.GatePassOutwardData.NoOfPackages = deliveryorderresult[0].DoTotalQty;
              this.GatePassOutwardData.SupplierWeight = deliveryorderresult[0].TotalWeight;
              this.SupplierWeightStatus = true;
              // this.calculateDifferenceWeight();
            }
          } else {
            this.GatePassOutwardData.SupplierWeight = null;
            this.GatePassOutwardData.NoOfPackages = null;
            this.SupplierWeightStatus = false;
          }
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  checkSaleOrderNoAndGetSupplierOnBasisOfSaleOrderGiven(orderID, DocTypeID) {
    this.service
      .GetSupplierBySaleOrderNo({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrderId: orderID,
        DocumentTypeId: DocTypeID,
      })
      .subscribe(
        (result) => {
          if (result == null || result == undefined) {
            this.WarningPopup("Sale Order is either not Present or is not Approved!");
            this.GatePassOutwardData.SaleOrderId = null;
            this.GatePassOutwardData.SupplierContractCode = null;
            this.GatePassOutwardData.SupplierCustomerId = null;
          } else {
            this.GatePassOutwardData.SupplierCustomerId = result[0].Id;
            this.GatePassOutwardData.SaleOrderId = result[0].SaleOrderId;
          }
        },
        (error) => {
          this.HandleError(error);
          this.GatePassOutwardData.SaleOrderId = null;
          this.GatePassOutwardData.SupplierContractCode = null;
          this.GatePassOutwardData.SupplierCustomerId = null;
        }
      );
  }
  CheckOrderNoAgainstDeleiveryOrderId(orderNo) {
    this.service
      .checkDeliveryOrderNoInGatePass({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 84,
        DocNo: orderNo,
      })
      .subscribe(
        (result) => {
          if (result > 0) {
            this.GatePassOutwardData.SaleOrderId = result;
            this.getweightByDeliveryOrderId(result);
          } else if (result <= 0) {
            this.WarningPopup("Delivery Order is either incorrect or not Approved yet!");
          }
        },
        (error) => {
          this.HandleError(error);
          this.GatePassOutwardData.SaleOrderId = null;
          this.GatePassOutwardData.SupplierContractCode = null;
          this.WarningPopup("Deleivery Order is either incorrect or Not Approved");
          this.GatePassOutwardForm1.instance.getEditor("SupplierContractCode").focus();
        }
      );
  }

  OrderNoLeave = (e) => {
    if (e.value > 0) {
      if (this.GatePassOutwardData.OtherSupCust == "" || this.GatePassOutwardData.OtherSupCust == null) {
        this.WarningPopup("Please Selece Order Type First!");
        this.GatePassOutwardForm1.instance.getEditor("OtherSupCust").focus();
        this.GatePassOutwardData.SupplierContractCode = null;
        return;
      } else if (this.GatePassOutwardData.GatepassType == "" || this.GatePassOutwardData.GatepassType == null) {
        this.WarningPopup("Please Select Gate Pass Type");
        this.GatePassOutwardData.SupplierContractCode = null;
        this.GatePassOutwardForm1.instance.getEditor("GatepassType").focus();
        return;
      }
      if (this.GatePassOutwardData.OtherSupCust == "SaleOrder") {
        this.SupplierDisabledStatus = false;
        for (let { ConfigDescription, ConfigKey } of this.configurations) {
          if (ConfigDescription == "SO Compulsory in GPO") {
            if (ConfigKey == "True") {
              if (this.GatePassOutwardData.SupplierContractCode != undefined && this.GatePassOutwardData.SupplierContractCode != null) {
                if (this.GatePassOutwardData.GatepassType == "Export") {
                  this.documentIdValue = 83;
                } else {
                  this.documentIdValue = 81;
                }
                this.checkSaleOrderNoAndGetSupplierOnBasisOfSaleOrderGiven(e.value, this.documentIdValue);
              }
            } else if (ConfigKey == "False") {
              this.GatePassOutwardData.SaleOrderId = null;
              this.WarningPopup("Sale Order Compulsory in GPO not Found!");
            }
          }
        }
      } else if (this.GatePassOutwardData.OtherSupCust == "DeliverOrder") {
        this.SupplierDisabledStatus = true;
        if (this.GatePassParamsId > 0 == false) {
          this.CheckOrderNoAgainstDeleiveryOrderId(e.value);
        }
      }
    } else {
    }
  };
  printAfterSave = ({ value }) => {
    if (value) {
      this.canPrintonSave = true;
    } else {
      this.canPrintonSave = false;
    }
  };

  onPrintsave(e) {
    this.service
      .getpdfReport({
        Id: e,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "290-InvRptOutwardGatePassSlip",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => this.HandleError(error)
      );
  }

  onPrint(e) {
    this.service
      .getpdfReport({
        Id: e.Id,
        //Compulosry
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "290-InvRptOutwardGatePassSlip",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => this.HandleError(error)
      );
  }

  onSave() {
    if (this.GatePassParamsId > 0) {
      if (this.UserRightsObject.canUpdate) {
        this.handleSave();
      } else {
        this.WarningPopup("You don't have right to update");
        return;
      }
    } else {
      if (this.UserRightsObject.canSave) {
        this.handleSave();
      } else {
        this.WarningPopup("You don't have right to save");
        return;
      }
    }
  }

  handleSave() {
    if (validate(this.GatePassOutwardForm1 && this.GatePassOutwardForm2 && this.GatePassOutwardForm3)) {
      if (this.GatePassParamsId > 0 == false) {
        if (this.GatePassOutwardData.Status != "Open") {
          this.WarningPopup("Status must be Open");
          this.GatePassOutwardData.Status = null;
          this.GatePassOutwardForm3.instance.getEditor("Status").focus();
          return;
        }
      } else {
        if (this.GatePassOutwardData.Status == "Open") {
          this.WarningPopup("Status must not be Open!");
          this.GatePassOutwardData.Status = null;
          this.GatePassOutwardForm3.instance.getEditor("Status").focus();
          return;
        }
        if (this.GatePassOutwardData.FactoryWeight == 0 || this.GatePassOutwardData.FactoryWeight == null) {
          this.WarningPopup("Factory Weight Not Found Against this GatePass!");
          return;
        }
        if (this.GatePassOutwardData.WeightDiffRemarks == null || this.GatePassOutwardData.WeightDiffRemarks.length <= 10) {
          this.WarningPopup("Weight Diff Remarks length must be greater than 10 its required!");
          this.GatePassOutwardForm3.instance.getEditor("WeightDiffRemarks").focus();
          return;
        }
      }

      this.GatePassOutwardData.IsApproved = false;
      this.GatePassOutwardData.PostState = false;
      this.GatePassOutwardData.RefDocumentEntryNo = 0;
      this.GatePassOutwardData.RefDocumentTypeId = 0;
      this.GatePassOutwardData.DocumentTypeId = 91;
      this.GatePassOutwardData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.GatePassOutwardData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.GatePassOutwardData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.GatePassOutwardData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.GatePassOutwardData.PostUser = parseInt(sessionStorage.getItem("UserId"));
      this.GatePassOutwardData.EntryDate = new Date();
      this.GatePassOutwardData.ModifyDate = new Date();
      this.GatePassOutwardData.PostDate = new Date();
      this.GatePassParamsId > 0 ? this.ActivateLoadPanel("Updating") : this.ActivateLoadPanel("Saving");
      this.service.GatepassSave(this.GatePassOutwardData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.GatePassParamsId > 0 ? this.SuccessPopup("Record updated successfully") : this.SuccessPopup("Record saved successfully!");
          if (this.GatePassParamsId > 0) {
            if (this.canPrintonSave) {
              this.onPrintsave(this.GatePassParamsId);
            }
          } else if (this.GatePassParamsId > 0 == false) {
            if (this.canPrintonSave) {
              this.onPrintsave(result);
            }
          }
          this.router.navigate([], { queryParams: { Id: null } });
          this.resetForm();
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
    this.RefreshButtonInGridToolbar(e, () =>
      this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("gatePassOutwardFormComponentGrid"), this.gatePassOutwardFormComponentGrid)
    );
    this.FilterButtonInGridToolbar(e);
  };
}
