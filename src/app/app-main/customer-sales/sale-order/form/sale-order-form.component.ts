import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { validate } from "src/app/shared/Base/validationHelper";
import { SaleOrder, PurchaseOrderDetail } from "../sale-order.model";
import { PurchaseOrderService } from "../sale-order.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { PdfReportsCommonMethods } from "src/app/shared/base/pdf-reports-common-methods";
import { MostUsedMethods } from "src/app/shared/Base/mostUsedMethods";
import { ShortcutKeysService } from "src/app/shared/Base/shortcut-Keys.service";
@Component({
  selector: "app-sale-order-rice-form",
  templateUrl: "./sale-order-form.component.html",
  styleUrls: ["./sale-order-form.component.scss"],
})
export class SaleOrderFormComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("SaleOrderForm1", { static: false }) //SaleOrderForm = PurchaseOrderForm
  SaleOrderForm1: DxFormComponent;
  @ViewChild("SaleOrderForm2", { static: false }) //SaleOrderForm = PurchaseOrderForm
  SaleOrderForm2: DxFormComponent;
  @ViewChild("SaleOrderForm3", { static: false }) //SaleOrderForm = PurchaseOrderForm
  SaleOrderForm3: DxFormComponent;
  @ViewChild("SaleOrderForm4", { static: false }) //SaleOrderForm = PurchaseOrderForm
  SaleOrderForm4: DxFormComponent;
  @ViewChild("SaleOrderForm5", { static: false }) //SaleOrderForm = PurchaseOrderForm
  SaleOrderForm5: DxFormComponent;
  @ViewChild("SaleOrderForm6", { static: false }) //SaleOrderForm = PurchaseOrderForm
  SaleOrderForm6: DxFormComponent;
  @ViewChild("SaleOrderForm7", { static: false }) //SaleOrderForm = PurchaseOrderForm
  SaleOrderForm7: DxFormComponent;
  SaleOrderFormData: SaleOrder; //PurchaseOrderData => formObject
  @ViewChild("SaleOrderDetailForm", { static: false }) //SaleOrderForm = PurchaseOrderDetailForm
  SaleOrderDetailForm: DxFormComponent;
  SaleOrderDetailFormData: PurchaseOrderDetail; //purchaseOrderDetailData = formObject
  branchList = [];
  projectList = [];
  orderCategoryList = [];
  supplierNameList: any;
  paymentTermList = [];
  deliveryTermList = [
    { Id: 1, Label: "Load" },
    { Id: 2, Label: "Ponch" },
  ];
  statusList = [
    { Id: 1, Label: "Open" },
    { Id: 2, Label: "Complete" },
    { Id: 3, Label: "Cancel" },
  ];
  //CommissionPanel
  commissionAgentList: any;
  CommissionTypeList = [{ name: "Flat" }, { name: "Percent" }, { name: "Comm Weight" }];
  CommissionRateList = [{ uom: 40 }, { uom: 50 }, { uom: 60 }, { uom: 100 }];
  //CommissionPanelEnd
  itemNameList: any;
  uomList = [];
  batchList = [];
  jobLotList = [];
  taxTypeList = [];
  CityAreaList = [];
  dataSource = [];
  updateRowIndex: number;
  detailEditMode: boolean;
  purchaseOrderParamsId: number;
  ListForAccordion = [
    {
      title: "Sales Person/ Comission Agent",
    },
  ];
  @ViewChild("SuppCustDetailUnderComboComponentForCustomer")
  SuppCustDetailUnderComboComponentForCustomer;
  @ViewChild("SuppCustDetailUnderComboComponentForComissionAgent")
  SuppCustDetailUnderComboComponentForComissionAgent;
  MostUsedMethods: MostUsedMethods;
  //========================================
  constructor(
    private commonService: CommonBaseService,
    private commonMethods: CommonMethodsForCombos,
    private service: PurchaseOrderService,
    private route: ActivatedRoute,
    private keyboardShourtcuts: ShortcutKeysService,
    private router: Router,
    private pdfReportsCommonMethods: PdfReportsCommonMethods
  ) {
    super();
    this.MostUsedMethods = new MostUsedMethods(commonMethods, keyboardShourtcuts);
    this.MostUsedMethods.HistoryGridShortcutKeys([
      { key: "control.s", ConsectiveNumberOfKeys: 1000, ActionToPerform: this.onSave.bind(this) },
      { key: "control.a", ConsectiveNumberOfKeys: 1000, ActionToPerform: this.resetForm.bind(this) },
      { key: "control.r", ConsectiveNumberOfKeys: 1000, ActionToPerform: this.FetchData.bind(this) },
      { key: "control.h", ConsectiveNumberOfKeys: 1000, ActionToPerform: this.GoToHistory.bind(this) },
      { key: "control.f", ConsectiveNumberOfKeys: 1000, ActionToPerform: this.FocusOnField.bind(this) },
      { key: "control.p", ConsectiveNumberOfKeys: 1000, ActionToPerform: this.ChangePrintAfterSaveOption.bind(this) },
    ]);
  }
  async ngOnInit() {
    this.purchaseOrderParamsId = this.route.snapshot.queryParams["Id"];
    await this.FetchData();
    // this.InventoryDefaultList = await this.commonMethods.GetInventoryDefaultsFromConfiguration();
    this.initForm();
  }
  async FetchData() {
    this.ActivateLoadPanel("Initializing Form!");
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("SaleOrder"));
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.itemNameList = await this.commonMethods.GenerateItemDataSourceForComboBind();
    this.batchList = await this.commonMethods.CropYear();
    this.supplierNameList = await this.commonMethods.GenerateSupplierCustomerDataSourceForComboBind();
    this.orderCategoryList = await this.commonMethods.GetAllOrderCategories();
    this.commissionAgentList = this.supplierNameList;
    this.paymentTermList = await this.commonMethods.PaymentTermsGetAll();
    this.CityAreaList = await this.commonMethods.CityGetByOrganizationAndCompany();
    this.jobLotList = await this.commonMethods.getJobLot();
    this.DeActivateLoadPanel();
  }
  public initForm() {
    this.SaleOrderFormData = new SaleOrder();
    this.SaleOrderDetailFormData = new PurchaseOrderDetail();
    this.SaleOrderFormData.BranchesId = this.branchList[0].Id;
    this.SaleOrderFormData.ProjectsId = this.projectList[0].Id;
    this.SaleOrderFormData.DocDate = new Date();
    this.SaleOrderFormData.OrderDueDate = new Date();
    this.SaleOrderFormData.OrderExpiryDate = new Date();
    this.SaleOrderFormData.DeliveryStartDate = new Date();
    this.SaleOrderFormData.OrderStatus = this.statusList[0].Label;
    this.SaleOrderFormData.DeliveryTerm = this.deliveryTermList[0].Label;
    this.SaleOrderFormData.PaymentTermsId = this.paymentTermList[1].Id;
    this.SaleOrderFormData.OrderCatagoryId = this.orderCategoryList[0].Id;
    this.purchaseOrderParamsId > 0 ? this.setFields4editMode() : this.getDocumentNo();
    this.FocusOnField();
  }
  FocusOnField() {
    this.SaleOrderForm2.instance.getEditor("OrderSupCustId").focus();
  }
  setFields4editMode() {
    this.ActivateLoadPanel("Fetching Data!");
    this.service.getPurchaseOrderById(this.purchaseOrderParamsId).subscribe(
      (result: SaleOrder) => {
        this.DeActivateLoadPanel();
        this.dataSource = result.SaleOrderDetailList;
        this.SaleOrderFormData = result;
      },
      (error) => {
        this.DeActivateLoadPanel();
        this.HandleError(error);
      }
    );
  }
  getDocumentNo() {
    this.service
      .getDocumentNo({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 81,
      })
      .subscribe(
        (result) => {
          this.SaleOrderFormData.DocNo = result;
        },
        (error) => console.log(error)
      );
  }
  handleOrderCategoryChange = (e) => {
    if (e.value > 0 == false) {
      this.SaleOrderFormData.CatagorySrNo = 0;
      return;
    }
    if (this.purchaseOrderParamsId > 0) return;
    this.service
      .getCategorySerialNo({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        Id: e.value,
      })
      .subscribe(
        (result) => {
          this.SaleOrderFormData.CatagorySrNo = result;
        },
        (error) => console.log(error)
      );
  };
  handleCustomerChange = (e) => {
    this.SuppCustDetailUnderComboComponentForCustomer.SetInfoObjectValues(e.value);
  };
  handleComissionAgentChange = (e) => {
    this.SuppCustDetailUnderComboComponentForComissionAgent.SetInfoObjectValues(e.value);
  };
  handleDocumentDateChange = (e) => {
    this.handleDueDaysChange({ value: this.SaleOrderFormData.OrderDueDays });
  };
  handleDueDaysChange = (e) => {
    if (e.value > 0 == false) {
      e.value = 0;
    }
    this.SaleOrderFormData.DocDate = new Date();
    this.SaleOrderFormData.OrderDueDate = new Date(this.SaleOrderFormData.DocDate.getFullYear(), this.SaleOrderFormData.DocDate.getMonth(), this.SaleOrderFormData.DocDate.getDate() + +e.value);
  };
  //
  handleItemNameChange = async (e) => {
    if (e.value > 0 == false) {
      this.uomList = [];
      return;
    }
    this.uomList = await this.commonMethods.getUOM(e.value);
    console.log(this.uomList);
  };
  handlePackUomChange = (e) => {
    if (e.value > 0 == false) {
      this.SaleOrderDetailFormData.UOMDescription = "0";
    } else if (parseFloat(this.SaleOrderDetailForm.instance.getEditor("OrderItemUOMId").option("text")) > 0) {
      this.SaleOrderDetailFormData.UOMDescription = this.SaleOrderDetailForm.instance.getEditor("OrderItemUOMId").option("text");
    }
    this.handleDetailCalculations(0);
  };
  handleRateUOMChange = (e) => {
    if (e.value > 0 == false) {
      this.SaleOrderDetailFormData.EquivalentRate = "0";
    } else if (parseFloat(this.SaleOrderDetailForm.instance.getEditor("OrderItemRateUOMId").option("text")) > 0) {
      this.SaleOrderDetailFormData.EquivalentRate = this.SaleOrderDetailForm.instance.getEditor("OrderItemRateUOMId").option("text");
    }
    this.handleDetailCalculations(0);
  };
  handleDetailCalculations = (e) => {
    let PackUom = 0;
    let Qty = 0;
    let Weight = 0;
    let Rate = 0;
    let RateUom = 0;
    let Amount = 0;
    if (parseFloat(this.SaleOrderDetailFormData.UOMDescription) > 0) {
      PackUom = parseFloat(this.SaleOrderDetailFormData.UOMDescription);
    } else if (parseFloat(this.SaleOrderDetailForm.instance.getEditor("OrderItemUOMId").option("text")) > 0) {
      PackUom = parseFloat(this.SaleOrderDetailForm.instance.getEditor("OrderItemUOMId").option("text"));
    }
    if (this.SaleOrderDetailFormData.OrderItemQty > 0) {
      Qty = this.SaleOrderDetailFormData.OrderItemQty;
    }
    Weight = PackUom * Qty;
    this.SaleOrderDetailFormData.NetWeight = parseFloat(Weight.toFixed(2));
    if (this.SaleOrderDetailFormData.OrderItemRate > 0) {
      Rate = this.SaleOrderDetailFormData.OrderItemRate;
    }
    if (parseFloat(this.SaleOrderDetailFormData.EquivalentRate) > 0) {
      RateUom = parseFloat(this.SaleOrderDetailFormData.EquivalentRate);
    } else if (parseFloat(this.SaleOrderDetailForm.instance.getEditor("OrderItemRateUOMId").option("text")) > 0) {
      RateUom = parseFloat(this.SaleOrderDetailForm.instance.getEditor("OrderItemRateUOMId").option("text"));
    }
    if (Weight > 0 && RateUom > 0) {
      Amount = (Weight / RateUom) * Rate;
    }
    this.SaleOrderDetailFormData.Amount = parseFloat(Amount.toFixed(2));
  };
  CalculateComissionAmount = (e) => {
    let ComissionType = "";
    let ComissionRate = 0;
    let ComissionRateUom = 0;
    let ComissionAmount = 0;
    if (this.SaleOrderFormData.CommissionType != null && this.SaleOrderFormData.CommissionType != undefined) {
      ComissionType = this.SaleOrderFormData.CommissionType;
    }
    if (this.SaleOrderFormData.CommRate > 0) {
      ComissionRate = this.SaleOrderFormData.CommRate;
    }
    if (this.SaleOrderFormData.UomScheduleIdCmRate > 0) {
      ComissionRateUom = parseFloat(this.SaleOrderForm7.instance.getEditor("UomScheduleIdCmRate").option("text"));
    }
    if (ComissionType == "Flat") {
      ComissionAmount = ComissionRate;
    } else if (ComissionType == "Percent") {
      if (this.dataSource != null && this.dataSource != undefined) {
        if (this.dataSource.length > 0) {
          let DetailAmount = 0;
          this.dataSource.map((item) => (DetailAmount += parseFloat(item.Amount)));
          if (DetailAmount > 0) {
            ComissionAmount = (DetailAmount * ComissionRate) / 100;
          }
        }
      }
    } else if (ComissionType == "Comm Weight") {
      if (this.dataSource != null && this.dataSource != undefined) {
        if (this.dataSource.length > 0) {
          let DetailWeight = 0;
          this.dataSource.map((item) => (DetailWeight += parseFloat(item.Amount)));
          if (DetailWeight > 0) {
            ComissionAmount = DetailWeight / ComissionRateUom / ComissionRate;
          }
        }
      }
    }
    this.SaleOrderFormData.CommAmount = parseFloat(ComissionAmount.toFixed(2));
  };
  checkClick(e) {}
  calculateItemAmount() {
    this.SaleOrderDetailFormData.OrderItemRateUOMId > 0 &&
      this.SaleOrderDetailFormData.OrderItemRate > 0 &&
      this.SaleOrderDetailForm.instance.getEditor("OrderItemRateUOMId").option("text") > 0 &&
      this.SaleOrderDetailFormData.NetWeight > 0 &&
      (this.SaleOrderDetailFormData.Amount =
        (this.SaleOrderDetailFormData.NetWeight / this.SaleOrderDetailForm.instance.getEditor("OrderItemRateUOMId").option("text")) * this.SaleOrderDetailFormData.OrderItemRate);
  }
  addDetailRecord2Grid() {
    if (validate(this.SaleOrderDetailForm)) {
      this.SaleOrderDetailFormData.ItemName = this.SaleOrderDetailForm.instance.getEditor("OrderItemId").option("text");
      this.SaleOrderDetailFormData.UOMDescription = this.SaleOrderDetailForm.instance.getEditor("OrderItemUOMId").option("text");
      this.SaleOrderDetailFormData.JobLotDescription = this.SaleOrderDetailForm.instance.getEditor("JobLotId").option("text");
      this.SaleOrderDetailFormData.EquivalentRate = this.SaleOrderDetailForm.instance.getEditor("OrderItemRateUOMId").option("text");
      if (this.updateRowIndex >= 0) {
        this.dataSource[this.updateRowIndex] = this.SaleOrderDetailFormData;
        this.updateRowIndex = -1;
        this.detailEditMode = false;
      } else {
        this.dataSource.push(this.SaleOrderDetailFormData);
      }
      this.dataGrid.instance.refresh();
      this.SaleOrderDetailForm.instance.getEditor("OrderItemId").focus();
      this.SaleOrderDetailFormData = new PurchaseOrderDetail();
    }
    this.CalculateComissionAmount(null);
  }
  editDetailRecordRow(editObject, index) {
    this.detailEditMode = true;
    this.updateRowIndex = index;
    this.SaleOrderDetailFormData = editObject;
  }
  cancelRecordDetailUpdate() {
    this.SaleOrderDetailFormData = new PurchaseOrderDetail();
    this.updateRowIndex = -1;
    this.detailEditMode = false;
  }
  deleteDetailRecordRow(index) {
    this.dataSource.splice(index, 1);
    this.CalculateComissionAmount(0);
  }
  async onPrint(Id) {
    this.ActivateLoadPanel("Loading Report!");
    this.OpenPdfReportInNewTab(await this.pdfReportsCommonMethods.SaleOrderRiceSlip_273(Id).catch((error) => this.HandleError(error)));
    this.DeActivateLoadPanel();
  }
  resetForm() {
    this.purchaseOrderParamsId = 0;
    this.router.navigate([], { queryParams: { Id: null } });
    this.dataSource = [];
    this.initForm();
  }
  ValidateDetailRecord() {
    let flag = true;
    let DataSourceFlag = false;
    if (this.dataSource != null && this.dataSource != undefined) {
      if (this.dataSource.length > 0) {
        DataSourceFlag = true;
        for (let i = 0; i < this.dataSource.length; i++) {
          if (this.dataSource[i].OrderItemId > 0 == false) {
            this.WarningPopup("Item is Required in Detail Grid Row # " + i + 1);
            flag = false;
            break;
          } else if (this.dataSource[i].NetWeight > 0 == false) {
            this.WarningPopup("Net Weight is Required in Detail Grid Row # " + i + 1);
            flag = false;
            break;
          } else if (this.dataSource[i].Amount > 0 == false) {
            this.WarningPopup("Amount is Required in Detail Grid Row # " + i + 1);
            flag = false;
            break;
          }
        }
      }
    }
    if (DataSourceFlag == false) {
      this.WarningPopup("No Detail Record Found!");
      flag = false;
    }
    return flag;
  }
  onSave() {
    if (this.purchaseOrderParamsId > 0 == false && this.UserRightsObject.canSave == false) {
      this.WarningPopup("You don't have Right to Save!");
      return;
    } else if (this.purchaseOrderParamsId > 0 && this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have Right to Update!");
      return;
    }
    this.handleSave();
  }
  GoToHistory() {
    this.router.navigate(["/cus-sales/sale-order-history"]);
  }
  handleSave() {
    if (validate(this.SaleOrderForm1) && validate(this.SaleOrderForm2) && validate(this.SaleOrderForm3) && validate(this.SaleOrderForm4) && validate(this.SaleOrderForm5)) {
      if (this.ValidateDetailRecord() == false) return;
      this.SaleOrderFormData.DocumentTypeId = 81;
      this.SaleOrderFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.SaleOrderFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.SaleOrderFormData.EntryUser = this.commonService.UserId();
      this.SaleOrderFormData.EntryDate = new Date();
      this.SaleOrderFormData.ModifyUser = this.commonService.UserId();
      this.SaleOrderFormData.ModifyDate = new Date();
      this.SaleOrderFormData.PostUser = this.commonService.UserId();
      this.SaleOrderFormData.PostDate = new Date();
      this.SaleOrderFormData.PostState = false;
      this.SaleOrderFormData.SaleOrderDetailList = this.dataSource;
      this.purchaseOrderParamsId > 0 ? this.ActivateLoadPanel("Updating!") : this.ActivateLoadPanel("Saving!");
      this.service.savePurchaseOrder(this.SaleOrderFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.purchaseOrderParamsId > 0 ? this.SuccessPopup("Order Updated Successfully!") : this.SuccessPopup("Order Saved Successfully!");
          if (this.MUST_PRINT_AFTER_SAVE == true) {
            this.onPrint(result);
          }
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
