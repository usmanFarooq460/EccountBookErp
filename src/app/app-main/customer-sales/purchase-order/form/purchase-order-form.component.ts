import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { validate } from "src/app/shared/Base/validationHelper";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { LcOrderService } from "../purchase-order.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { PurchaseOrderModel, PurchaseOrderDetailModel } from "../purchase-order.model";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-purchase-order-form",
  templateUrl: "./purchase-order-form.component.html",
  styleUrls: ["./purchase-order-form.component.scss"],
})
export class PurchaseOrderFormComponent extends BaseActions implements OnInit {
  @ViewChild("PurchaseOrderDetailGrid", { static: false })
  PurchaseOrderDetailGrid: DxDataGridComponent;
  @ViewChild("PurchaseOrderForm", { static: false })
  PurchaseOrderForm: DxFormComponent;
  PurchaseOrderFormData: PurchaseOrderModel;
  @ViewChild("PurchaseOrderDetailForm", { static: false })
  PurchaseOrderDetailForm: DxFormComponent;
  PurchaseOrderDetailFormData: PurchaseOrderDetailModel;
  //#region ConditionalVariables

  updateRowIndex: number;
  detailEditMode: boolean;
  PurchaseOrderParamsId: number = 0;
  canView: boolean;
  canSave: boolean;
  canPrint: boolean;
  canUpdate: boolean;
  //#endregion
  //#region DataVariables
  SupplierCustomerList: any;

  ItemList: any;
  LcOrderList = [];
  LcOrderListBySupplierId = [];
  DeliveryTermList = [];
  PaymentTermList = [];
  LoadingPortList = [];
  DestinationPortList = [];
  MultiCurrencyList = [];

  organizationId: number;
  companyId: number;
  JobLotList = [];
  StatusList = [
    { Id: 1, name: "Open" },
    { Id: 2, name: "Complete" },
    { Id: 3, name: "Cancel" },
  ];
  PackingTypeList = [];
  UomList = [];
  dataSource = [];
  RecordToBeCompared: any;
  @ViewChild("SuppCustDetailUnderComboComponent")
  SuppCustDetailUnderComboComponent;

  //#endregion
  constructor(private commonMethods: CommonMethodsForCombos, private commonService: CommonBaseService, private service: LcOrderService, private route: ActivatedRoute, private router: Router) {
    super();
  }
  async ngOnInit() {
    this.PurchaseOrderParamsId = this.route.snapshot.queryParams["Id"];
    await this.GetData();
    this.initForm();
  }
  async GetData() {
    this.ActivateLoadPanel("Loading Form");
    this.userRights();
    this.organizationId = await this.commonService.OrganizationId();
    this.companyId = await this.commonService.CompanyId();

    this.JobLotList = await this.commonMethods.getJobLot();
    this.ItemList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.ItemsGetAll());
    this.SupplierCustomerList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.SupplierCustomerForExport());

    this.PackingTypeList = await this.commonMethods.PackingTypeExportGetAll();
    this.GetLcOrderNo();
    this.DeliveryTermList = await this.commonMethods.DeliveryTermExport();
    this.PaymentTermList = await this.commonMethods.PaymentTermForExport();
    this.LoadingPortList = await this.commonMethods.SeaPortsForExport();
    this.MultiCurrencyList = await this.commonMethods.MultiCurrency();
    console.log(this.MultiCurrencyList);
    this.DeActivateLoadPanel();
  }
  public initForm() {
    this.PurchaseOrderFormData = new PurchaseOrderModel();
    this.PurchaseOrderDetailFormData = new PurchaseOrderDetailModel();
    this.PurchaseOrderFormData.DocDate = new Date();
    this.PurchaseOrderFormData.LcPoOrderStatus = this.StatusList[0].name;
    this.PurchaseOrderFormData.BillOfLadingDate = new Date();
    this.PurchaseOrderFormData.ETADate = new Date();
    this.PurchaseOrderFormData.ETDDate = new Date();
    this.setBaseCurrency();
    if (this.PurchaseOrderParamsId > 0 == false) {
      this.GenerateCode();
    }
    if (this.PurchaseOrderParamsId > 0) {
      this.setFields4editMode();
    }
  }
  //Focus On Field
  setFocus = (e) =>
    setTimeout(() => {
      e.component.focus();
    }, 0);
  setFields4editMode() {
    this.ActivateLoadPanel("Fetching Data");
    this.service.PurchaseOrderGetById(this.PurchaseOrderParamsId).subscribe(
      (result) => {
        this.DeActivateLoadPanel();
        console.log(result);
        this.PurchaseOrderFormData = result;
        this.RecordToBeCompared = JSON.parse(JSON.stringify(result));
        this.dataSource = result.ImPurchaseOrderPackingDetailslst;
        this.homeCurrencyCalculation(0);
      },
      (error) => {
        this.DeActivateLoadPanel();
        this.HandleError(error);
        console.log(error);
      }
    );
  }
  homeCurrencyCalculation = (e) => {
    let exrate = 0;
    let fcyamount = 0;
    let totalhomecurrencyamount = 0;
    exrate = this.PurchaseOrderFormData.ExchangeRate;
    if (this.PurchaseOrderParamsId > 0) {
      for (let i = 0; i < this.dataSource.length; i++) {
        fcyamount += this.dataSource[i].ItemAmount;
      }
    } else {
      fcyamount = this.PurchaseOrderFormData.FcyAmount;
    }
    if (exrate != 0 && fcyamount > 0) {
      totalhomecurrencyamount = exrate * fcyamount;
      this.PurchaseOrderFormData.Amount = totalhomecurrencyamount;
      this.ParporationHomeCurrencyAmount(fcyamount);
    } else {
      this.PurchaseOrderFormData.Amount = 0;
      this.ParporationHomeCurrencyAmount(fcyamount);
    }
  };
  ParporationHomeCurrencyAmount = (e) => {
    let totalamount = 0;
    let totalfcyAmount = 0;
    let newlist = [];
    totalamount = this.PurchaseOrderFormData.Amount;
    totalfcyAmount = e;
    if (totalamount > 0 && totalfcyAmount > 0) {
      for (let i = 0; i < this.dataSource.length; i++) {
        newlist.push({
          Id: this.dataSource[i].Id,
          ExImLcOrderPurchaseOrderId: this.dataSource[i].ExImLcOrderPurchaseOrderId,
          ItemId: this.dataSource[i].ItemId,
          ItemUomId: this.dataSource[i].ItemUomId,
          PackingTypeId: this.dataSource[i].PackingTypeId,
          RateUomId: this.dataSource[i].RateUomId,
          ToWarehouseId: this.dataSource[i].ToWarehouseId,
          JobLotId: this.dataSource[i].JobLotId,
          ItemName: this.dataSource[i].ItemName,
          PackingType: this.dataSource[i].PackingType,
          Qty: this.dataSource[i].Qty,
          ItemUOM: this.dataSource[i].ItemUOM,
          NoOfPacks: this.dataSource[i].NoOfPacks,
          PackingWeight: this.dataSource[i].PackingWeight,
          GrossWeight: this.dataSource[i].GrossWeight,
          ItemRate: this.dataSource[i].ItemRate,
          RateUom: this.dataSource[i].RateUom,
          ItemAmount: this.dataSource[i].ItemAmount,
          WareHouseName: this.dataSource[i].WareHouseName,
          JobLotDescription: this.dataSource[i].JobLotDescription,
          ContainerNo: this.dataSource[i].ContainerNo,
          RemarksDetail: this.dataSource[i].RemarksDetail,
          HomeCurrencyAmount: (totalamount / totalfcyAmount) * this.dataSource[i].ItemAmount,
        });
      }
      this.dataSource = [];
      this.dataSource = newlist;
    }
  };
  //Functions

  //==========================04 Feb 2022
  async setBaseCurrency() {
    console.log(this.MultiCurrencyList);
    let baseCurrencyId = await this.commonMethods.GetConfigurationByOrgCompandConfigDescription("Base Currency");
    this.PurchaseOrderFormData.HomeCurrencyId = this.MultiCurrencyList.find(({ Id }) => Id == baseCurrencyId).Id;
  }

  //=====================================
  //Add Data To Grid
  GetItemNameFromDetail() {
    for (let i = 0; i < this.dataSource.length; i++) {}
  }
  gettotalcurrencyamount() {
    if (this.PurchaseOrderFormData.FcyAmount > 0 && this.PurchaseOrderFormData.ExchangeRate > 0) {
      this.PurchaseOrderFormData.Amount = this.PurchaseOrderFormData.FcyAmount * this.PurchaseOrderFormData.ExchangeRate;
    }
  }

  editDetailRecordRow(editObject, index) {
    this.detailEditMode = true;
    this.updateRowIndex = index;
    this.PurchaseOrderDetailFormData = editObject;
  }
  deleteDetailRecordRow(index) {
    this.dataSource.splice(index, 1);
    this.CalculateTotalFCurrencyAmount();
    this.gettotalcurrencyamount();
    this.homeCurrencyCalculation(0);
  }
  addDublicateRowDetailRecord2Grid(editObject) {
    this.dataSource.push(editObject);
    this.CalculateTotalFCurrencyAmount();
    this.gettotalcurrencyamount();
    this.homeCurrencyCalculation(0);
  }
  addDetailRecord2Grid() {
    if (validate(this.PurchaseOrderDetailForm)) {
      if (this.PurchaseOrderDetailFormData.GrossWeight > 0 == false) {
        this.WarningPopup("Gross Weight is Required In Detial!");
        return;
      } else if (this.PurchaseOrderDetailFormData.ItemAmount > 0 == false) {
        this.WarningPopup("Item Amount is Required In Detial!");
        return;
      }
      this.PurchaseOrderDetailFormData.ItemName = this.PurchaseOrderDetailForm.instance.getEditor("ItemId").option("text");
      this.PurchaseOrderDetailFormData.ItemUOM = this.PurchaseOrderDetailForm.instance.getEditor("ItemUomId").option("text");
      this.PurchaseOrderDetailFormData.PackingType = this.PurchaseOrderDetailForm.instance.getEditor("PackingTypeId").option("text");
      this.PurchaseOrderDetailFormData.RateUom = this.PurchaseOrderDetailForm.instance.getEditor("RateUomId").option("text");
      if (this.updateRowIndex >= 0) {
        this.dataSource[this.updateRowIndex] = this.PurchaseOrderDetailFormData;
        this.updateRowIndex = -1;
        this.detailEditMode = false;
      } else {
        this.dataSource.push(this.PurchaseOrderDetailFormData);
      }

      this.PurchaseOrderDetailFormData = new PurchaseOrderDetailModel();
      this.PurchaseOrderDetailForm.instance.getEditor("Qty").focus();
      this.CalculateTotalFCurrencyAmount();
      this.gettotalcurrencyamount();
      this.homeCurrencyCalculation(0);
    }
  }
  onTransitDays = (e) => {
    if (this.PurchaseOrderFormData.TransitDays > 0) {
      this.PurchaseOrderFormData.TransitDays;
      this.PurchaseOrderFormData.ETADate = new Date();
    } else {
      this.PurchaseOrderFormData.ETADate = new Date();
    }
  };
  //==================================================================================25-Nov-2021
  //#region ComboFill
  GenerateCode() {
    this.service
      .GenerateCode({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        DocumentTypeId: 236,
      })
      .subscribe(
        (result) => {
          this.PurchaseOrderFormData.DocNo = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  GetLcOrderNo() {
    this.service
      .GetLcOrderNo({
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
        DocumentTypeId: 231,
      })
      .subscribe(
        (result) => {
          this.LcOrderList = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  FilterLcOrderBySupplierId = (e) => {
    this.SuppCustDetailUnderComboComponent.SetInfoObjectValues(e.value);
    this.LcOrderListBySupplierId = this.LcOrderList.filter(({ SupCustId }) => SupCustId == e.value);
  };
  GetDataOnBaseOfLcOrder = (e) => {
    if (e.value > 0) {
      this.GetLcOrderById(e.value);
      if (this.PurchaseOrderParamsId > 0 && this.RecordToBeCompared.ExImLcOrderId == e.value) {
        return;
      }
      this.GenerateDocCodeByLcContract(e.value);
    }
  };
  GenerateDocCodeByLcContract(e) {
    this.service
      .GenerateDocCodeByLcContract({
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
        DocumentTypeId: 236,
        Id: e,
      })
      .subscribe(
        (result) => {
          this.PurchaseOrderFormData.DocNoByLcOrder = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  GetLcOrderById(e) {
    if (e > 0 == false) {
      this.resetDataofBaselc();
      return;
    }
    if (this.PurchaseOrderParamsId > 0) {
      if (e == this.RecordToBeCompared.ExImLcOrderId) {
        return;
      }
    }
    this.service.GetDataOnBaseOfLcContract(e).subscribe(
      (result) => {
        console.log(result);
        if (result == null || result == undefined) {
          this.resetDataofBaselc();
          return;
        }
        this.PurchaseOrderFormData.SupplierOrderNo = result.LcOrderDocNo;
        this.PurchaseOrderFormData.SupplierOrderDate = new Date(result.LcOrderDate);
        this.PurchaseOrderFormData.DeliveryTermId = result.DeliveryTermId;
        this.PurchaseOrderFormData.LoadingPortId = result.LoadingPortId;
        this.PurchaseOrderFormData.Containers = result.NoOfContainers;
        this.PurchaseOrderFormData.SupplierInvoiceDate = new Date(result.LcOrderDate);
        this.PurchaseOrderFormData.DestinationPortId = result.DestinationPortId;
        this.PurchaseOrderFormData.ImporterBankId = result.ImporterBankId;
        this.PurchaseOrderFormData.ExporterBankId = result.ExporterBankId;
        this.PurchaseOrderFormData.PaymentTermId = result.PaymentTermId;
        this.PurchaseOrderFormData.FcyId = result.FcurrencyId;
        // this.PurchaseOrderFormData.FcyAmount = result.FCurrencyAmount;
        // this.PurchaseOrderFormData.LcPoOrderStatus = result.Status;
        this.PurchaseOrderFormData.SpecialInstructions = result.RemarksHeader;
        this.PurchaseOrderFormData.CommodityDetails = result.CommodityDetial;
        // this.PurchaseOrderFormData.Mton = result.NetWeightKgs / 1000;
        this.dataSource = [];
        for (let i = 0; i < result.LcOrderDetail.length; i++) {
          this.dataSource.push({
            ItemId: result.LcOrderDetail[i].ExImItemId,
            ItemUomId: result.LcOrderDetail[i].UOMScheduleIdOuter,
            PackingTypeId: result.LcOrderDetail[i].InvPackingMaterialTypeId,
            RateUomId: result.LcOrderDetail[i].UOMScheduleIdRate,
            ItemName: result.LcOrderDetail[i].ItemName,
            PackingType: result.LcOrderDetail[i].ExImPackMaterialTypeName,
            Qty: result.LcOrderDetail[i].OuterQty,
            ItemUOM: result.LcOrderDetail[i].UOMScheduleIdOuterName,
            NoOfPacks: result.LcOrderDetail[i].NoOfUnit,
            PackingWeight: 0,
            GrossWeight: result.LcOrderDetail[i].NetWeight,
            ItemRate: result.LcOrderDetail[i].RatePrice,
            RateUom: result.LcOrderDetail[i].UOMScheduleIdRateName,
            ItemAmount: result.LcOrderDetail[i].TotalAmount,
          });
        }
        this.CalculateTotalFCurrencyAmount();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  CalculateTotalFCurrencyAmount() {
    let amount = 0;
    if (this.dataSource.length > 0) {
      for (let i = 0; i < this.dataSource.length; i++) {
        amount += parseFloat(this.dataSource[i].ItemAmount);
      }
    }
    this.PurchaseOrderFormData.FcyAmount = amount;
  }
  resetDataofBaselc() {
    this.PurchaseOrderFormData.DocNoByLcOrder = null;
    this.PurchaseOrderFormData.SupplierOrderNo = null;
    this.PurchaseOrderFormData.SupplierOrderDate = new Date();
    this.PurchaseOrderFormData.DeliveryTermId = null;
    this.PurchaseOrderFormData.LoadingPortId = null;
    this.PurchaseOrderFormData.DestinationPortId = null;
    this.PurchaseOrderFormData.ImporterBankId = null;
    this.PurchaseOrderFormData.ExporterBankId = null;
    this.PurchaseOrderFormData.PaymentTermId = null;
    this.PurchaseOrderFormData.FcyId = null;
    this.PurchaseOrderFormData.FcyAmount = null;
    // this.PurchaseOrderFormData.LcPoOrderStatus =null
    this.PurchaseOrderFormData.SpecialInstructions = null;
    this.PurchaseOrderFormData.CommodityDetails = null;
  }
  async getUomListByItemId(e) {
    this.UomList = await this.commonMethods.getUOM(e);
    this.handleWeightAndAmountCalculation(1);
  }
  handleItemChange = (e) => {
    this.getUomListByItemId(e.value);
  };
  //#endregion
  //#region Calculations
  handleWeightAndAmountCalculation = (e) => {
    let qty = 0;
    let netWeight = 0;
    let uom = 0;
    let noOfBags = 0;
    let GrossWeight = 0;
    let packinWeight = 0;
    let rate = 0;
    let rateUom = 0;
    let amount = 0;
    if (parseFloat(this.PurchaseOrderDetailForm.instance.getEditor("Qty").option("text")) > 0) {
      qty = parseFloat(this.PurchaseOrderDetailForm.instance.getEditor("Qty").option("text"));
    }
    if (parseInt(this.PurchaseOrderDetailForm.instance.getEditor("ItemUomId").option("text")) > 0) {
      uom = parseInt(this.PurchaseOrderDetailForm.instance.getEditor("ItemUomId").option("text"));
    } else if (parseInt(this.PurchaseOrderDetailFormData.ItemUOM) > 0) {
      uom = parseInt(this.PurchaseOrderDetailFormData.ItemUOM);
    }
    netWeight = qty * 1000;
    this.PurchaseOrderDetailFormData.NetWeight = netWeight;
    noOfBags = netWeight / uom;
    this.PurchaseOrderDetailFormData.NoOfPacks = noOfBags;
    if (this.PurchaseOrderDetailFormData.PackingWeight > 0) {
      packinWeight = this.PurchaseOrderDetailFormData.PackingWeight;
    }
    GrossWeight = netWeight + packinWeight;
    this.PurchaseOrderDetailFormData.GrossWeight = GrossWeight;
    //================Amount
    if (this.PurchaseOrderDetailFormData.ItemRate > 0) {
      rate = this.PurchaseOrderDetailFormData.ItemRate;
    }
    if (parseInt(this.PurchaseOrderDetailForm.instance.getEditor("RateUomId").option("text")) > 0) {
      rateUom = parseInt(this.PurchaseOrderDetailForm.instance.getEditor("RateUomId").option("text"));
    } else if (parseInt(this.PurchaseOrderDetailFormData.RateUom) > 0) {
      rateUom = parseInt(this.PurchaseOrderDetailFormData.RateUom);
    }
    if (netWeight > 0 && rateUom > 0) {
      amount = (rate / rateUom) * netWeight;
    }
    this.PurchaseOrderDetailFormData.ItemAmount = amount;
  };
  //#endregion
  //=============================================================================================
  resetForm() {
    this.PurchaseOrderParamsId = null;
    this.dataSource = [];
    this.initForm();
  }
  userRights() {
    this.commonService
      .userRights({
        UserId: this.commonService.UserId(),
        ScreenName: "frmImpPurchaseOrder",
        RightName: this.commonService.RoleName(),
      })
      .subscribe(
        (result) => {
          for (let { RightName, Value } of result) {
            if (RightName === "Save") {
              this.canSave = Value;
            }
            if (RightName === "Print") {
              this.canPrint = Value;
            }
            if (RightName === "Update") {
              this.canUpdate = Value;
            }
          }
        },
        (error) => console.log(error)
      );
  }
  onSave() {
    if (this.PurchaseOrderParamsId > 0) {
      if (this.canUpdate) {
        this.handleSave();
      } else {
        this.WarningPopup("You don't have right to update!");
        return;
      }
    } else {
      if (this.canSave) {
        this.handleSave();
      } else {
        this.WarningPopup("You don't have right to save!");
        return;
      }
    }
  }

  //=============================================================
  handleSave() {
    if (validate(this.PurchaseOrderForm)) {
      if (this.dataSource.length > 0 == false) {
        this.WarningPopup("Please add detail Record");
        return;
      }
      this.PurchaseOrderFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.PurchaseOrderFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.PurchaseOrderFormData.EntryDate = new Date();
      this.PurchaseOrderFormData.ModifyDate = new Date();
      this.PurchaseOrderFormData.EntryUserId = parseInt(sessionStorage.getItem("UserId"));
      this.PurchaseOrderFormData.ModifyUserId = parseInt(sessionStorage.getItem("UserId"));
      this.PurchaseOrderFormData.ApprovedDate = new Date();
      this.PurchaseOrderFormData.DocumentTypeId = 236;
      this.PurchaseOrderFormData.ArrivalDate = this.PurchaseOrderFormData.ETADate;
      for (let i = 0; i < this.dataSource.length; i++) {
        if (this.dataSource[i].Qty > 0 == false) {
          this.WarningPopup("Please Enter Qty in Mtons in Detial Row#" + (i + 1) + " .");
          return;
        } else if (this.dataSource[i].GrossWeight > 0 == false) {
          this.WarningPopup("Gross weigt not found in Detial Row#" + (i + 1) + " .");
          return;
        } else if (this.dataSource[i].ItemAmount > 0 == false) {
          this.WarningPopup("Amount not found in Detail Row#" + (i + 1) + " .");
        }
        this.dataSource[i].Qty = this.dataSource[i].Qty;
      }
      this.PurchaseOrderFormData.ImPurchaseOrderPackingDetailslst = this.dataSource;
      if (this.PurchaseOrderParamsId > 0) {
        this.ActivateLoadPanel("Updating");
      } else if (this.PurchaseOrderParamsId > 0 == false) {
        this.ActivateLoadPanel("Saving!");
      }
      this.service.PurchaseOrderSave(this.PurchaseOrderFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.PurchaseOrderParamsId ? this.SuccessPopup("Record Updated Successfully!") : this.SuccessPopup("Record Saved Successfully!");
          this.dataSource = [];
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
}
