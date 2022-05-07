import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { validate } from "src/app/shared/Base/validationHelper";
import { DataSourceDTO, PurchaseOrder, PurchaseOrderDetail } from "../sale-order-rice.model";
import { PurchaseOrderService } from "../sale-order-rice.service";
import notify from "devextreme/ui/notify";

@Component({
  selector: "app-sale-order-rice-form",
  templateUrl: "./sale-order-rice-form.component.html",
  styleUrls: [],
})
export class SaleOrderRiceFormComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  @ViewChild("POF", { static: false }) //POF = PurchaseOrderForm
  POF: DxFormComponent;
  POD: PurchaseOrder; //PurchaseOrderData => formObject
  @ViewChild("POFDetail", { static: false }) //POF = PurchaseOrderDetailForm
  POFDetail: DxFormComponent;
  PODDetail: PurchaseOrderDetail; //purchaseOrderDetailData = formObject
  companyList = [];
  branchList = [];
  projectList = [];
  orderCategoryList = [];
  supplierNameList = [];
  paymentTermList;
  deliveryTermList = [
    { Id: 1, Label: "Cost" },
    { Id: 2, Label: "Cost & Freight" },
  ];
  statusList = [
    { Id: 1, Label: "Open" },
    { Id: 2, Label: "Complete" },
    { Id: 3, Label: "Cancel" },
  ];
  //CommissionPanel
  commissionAgentList = [];
  CommissionTypeList = [{ name: "Flat" }, { name: "Percent" }, { name: "Comm Weight" }];
  CommissionRateList = [{ uom: 40 }, { uom: 50 }, { uom: 60 }, { uom: 100 }];
  DetailAmountTotal: number;
  DetailWeightTotal: number;
  //CommissionPanelEnd
  itemNameList;
  uomList = [];
  batchList = [];
  jobLotList = [];
  taxTypeList = [];
  dataSource = new Array<DataSourceDTO>();
  currentDate: Date = new Date();
  dueDays: number;
  dueDate: Date;
  taxPercent: number;
  tempItemAmount;
  organizationId: number;
  companyId: number;
  updateRowIndex: number;
  detailEditMode: boolean;
  purchaseOrderParamsId: number;
  id4submit: number;
  orderCatagoryId: number;
  CatagorySrNo: number;
  //
  SalesManAgentStatus: boolean;
  CommTypeStatus: boolean;
  CommRateStatus: boolean;
  CommRateUomStatus: boolean;

  canView: boolean;
  canSave: boolean;
  canPrint: boolean;
  canUpdate: boolean;
  constructor(private commonService: CommonBaseService, private service: PurchaseOrderService, private route: ActivatedRoute, private router: Router) {}

  async ngOnInit() {
    this.purchaseOrderParamsId = this.route.snapshot.queryParams["Id"];
    this.userRights();
    this.organizationId = this.commonService.OrganizationId();
    this.companyId = this.commonService.CompanyId();
    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();

    this.initForm();
    // this.setFields4editMode();
    this.GetbyId();
  }

  public initForm() {
    this.POD = new PurchaseOrder();
    this.PODDetail = new PurchaseOrderDetail();
    this.SalesManAgentStatus = true;
    this.CommTypeStatus = true;
    this.CommRateStatus = true;
    this.CommRateUomStatus = true;
    this.getSupplierName();
    this.getPaymentTerm();
    this.getOrderCategory();
    if (this.purchaseOrderParamsId > 0 == false) {
      this.getDocumentNo();
      // this.POD.OrderCatagoryId = this.orderCategoryList[4].Id;
    }
    this.getItem();
    this.getBatch();
    this.getJobLot();

    this.POD.CompanyId = this.companyList[0].Id;
    this.POD.BranchesId = this.branchList[0].Id;
    this.POD.ProjectsId = this.projectList[0].Id;

    this.POD.DocDate = new Date();
    this.POD.OrderDueDate = new Date();
    this.POD.OrderExpiryDate = new Date();
    this.POD.DeliveryStartDate = new Date();
    this.POD.OrderStatus = this.statusList[0].Label;
    this.POD.DeliveryTerm = this.deliveryTermList[0].Label;
  }

  setFocus = (e) =>
    setTimeout(() => {
      e.component.focus();
    }, 0);

  GetbyId() {
    if (this.purchaseOrderParamsId > 0) {
      this.id4submit = this.purchaseOrderParamsId;
      this.service.getPurchaseOrderById(this.purchaseOrderParamsId).subscribe(
        (result: PurchaseOrder) => {
          this.POD.DeliveryDays = result.DeliveryDays;
          this.POD.RemarksHeader = result.RemarksHeader;
          this.POD.CommAmount = result.CommAmount;
          this.orderCatagoryId = result.OrderCatagoryId;
          this.CatagorySrNo = result.CatagorySrNo;
          this.POD = result;
          this.dataSource = result.SaleOrderDetailList;

          this.commissionFieldenabled();
        },
        (error) => console.log(error)
      );
    }
  }
  getOrderCategory() {
    this.service.getOrderCategory().subscribe(
      (result) => (this.orderCategoryList = result),
      (error) => console.log(error)
    );
  }

  getCategorySerialNo(orderCategoryId) {
    if (this.orderCatagoryId != orderCategoryId) {
      this.service
        .getCategorySerialNo({
          CompanyId: this.companyId,
          OrganizationId: this.organizationId,
          Id: orderCategoryId,
        })
        .subscribe(
          (result) => {
            this.POD.CatagorySrNo = result;
          },
          (error) => console.log(error)
        );
    } else {
      this.POD.CatagorySrNo = this.CatagorySrNo;
    }
  }

  getDocumentNo() {
    this.service.getDocumentNo({ CompanyId: this.companyId, OrganizationId: this.organizationId, DocumentTypeId: 81 }).subscribe(
      (result) => {
        this.POD.DocNo = result;
      },

      (error) => console.log(error)
    );
  }

  handleOrderCategoryChange = (e) => {
    e.value && this.getCategorySerialNo(e.value);
  };

  getSupplierName() {
    this.service
      .getSupplierName({
        CompanyId: this.companyId,
        OrganizationId: this.organizationId,
        CustomerGroupId: 1,
      })
      .subscribe(
        (result) => {
          this.supplierNameList = result;
          this.commissionAgentList = result;
        },
        (error) => console.log(error)
      );
  }

  getPaymentTerm() {
    this.service
      .getPaymentTerm({
        CompanyId: this.companyId,
        OrganizationId: this.organizationId,
      })
      .subscribe(
        (result) => {
          this.paymentTermList = result;
        },

        (error) => console.log(error)
      );
  }

  handleDocumentDateChange = () => {
    if (this.id4submit > 0 == false) {
      this.handleDueDaysChange({ value: this.dueDays });
    }
  };

  handleDueDaysChange = ({ value }) => {
    if (this.id4submit > 0 == false) {
      this.dueDays = value;
      value && value > 0 && (this.POD.OrderDueDate = new Date(this.POD.DocDate.getFullYear(), this.POD.DocDate.getMonth(), this.POD.DocDate.getDate() + +value));
    }
  };
  //
  getItem() {
    this.service
      .getItem({
        CompanyId: this.companyId,
        OrganizationId: this.organizationId,
      })
      .subscribe(
        (result) => (this.itemNameList = result),
        (error) => console.log(error)
      );
  }

  getUOM(itemId) {
    this.service
      .getUOM({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        ItemId: itemId,
      })
      .subscribe(
        (result) => (this.uomList = result),
        (error) => console.log(error)
      );
  }

  handleItemNameChange = (e) => {
    e.value && this.getUOM(e.value);
  };

  calculateTotalQuantity() {
    this.PODDetail.OrderItemQty > 0 &&
      this.POFDetail.instance.getEditor("OrderItemUOMId").option("text") > 0 &&
      (this.PODDetail.NetWeight = this.PODDetail.OrderItemQty * this.POFDetail.instance.getEditor("OrderItemUOMId").option("text"));
  }

  handlePackUOMChange = (e) => {
    e.value && this.PODDetail.OrderItemQty > 0 ? (this.calculateTotalQuantity(), this.calculateItemAmount()) : (this.PODDetail.NetWeight = null);
  };

  handleQuantityChange = (e) => {
    !isNaN(e.value) && e.value > 0 ? (this.calculateTotalQuantity(), this.calculateItemAmount()) : (this.PODDetail.NetWeight = null);
  };

  getBatch() {
    this.service.getBatch().subscribe(
      (result) => (this.batchList = result),
      (error) => console.log(error)
    );
  }

  getJobLot() {
    this.service
      .getJobLot({
        CompanyId: this.companyId,
        OrganizationId: this.organizationId,
      })
      .subscribe(
        (result) => (this.jobLotList = result),
        (error) => console.log(error)
      );
  }
  CommissionAgentSelection = (e) => {
    if (this.id4submit > 0 == false) {
      if (e.value) {
        this.POD.CommissionType = this.CommissionTypeList[0].name;
      }
    }
  };
  CommissionRate = (e) => {
    if (e.value) {
      this.handleCommissionAmountChange(null);
    }
  };
  CommissionRateUOM = (e) => {
    if (e.value) {
      this.handleCommissionAmountChange(null);
    }
  };
  handleCommissionAmountChange = (e) => {
    if (this.dataSource.length > 0) {
      let GridWeighTotal = 0;
      let GridAmountTotal = 0;

      this.dataSource.map(({ NetWeight }) => (GridWeighTotal += NetWeight));
      this.dataSource.map(({ Amount }) => (GridAmountTotal += Amount));
      if (this.id4submit > 0 == false) {
        if (this.POD.CommissionType != "Flat") {
          if (this.POD.CommissionType === "Percent") {
            this.POD.CommAmount = (GridAmountTotal * this.POD.CommRate) / 100;
          } else {
            this.POD.CommAmount = (GridWeighTotal / this.POD.UomScheduleIdCmRate) * this.POD.CommRate;
          }
        } else {
          this.POD.CommAmount = this.POD.CommRate;
        }
      } else {
        if (this.POD.CommissionType != "Flat") {
          if (this.POD.CommissionType === "Percent") {
            this.POD.CommAmount = (GridAmountTotal * this.POD.CommRate) / 100;
          } else {
            this.POD.CommAmount = (GridWeighTotal / parseInt(this.POF.instance.getEditor("UomScheduleIdCmRate").option("text"))) * this.POD.CommRate;
          }
        } else {
          this.POD.CommAmount = this.POD.CommAmount;
        }
      }
    }
  };
  onContentReady = (e) => {
    this.DetailAmountTotal = e.component.getTotalSummaryValue("Amount");
    this.DetailWeightTotal = e.component.getTotalSummaryValue("NetWeight");
  };
  calculateItemAmount() {
    this.PODDetail.OrderItemRateUOMId > 0 &&
      this.PODDetail.OrderItemRate > 0 &&
      this.POFDetail.instance.getEditor("OrderItemRateUOMId").option("text") > 0 &&
      this.PODDetail.NetWeight > 0 &&
      (this.PODDetail.Amount = (this.PODDetail.NetWeight / this.POFDetail.instance.getEditor("OrderItemRateUOMId").option("text")) * this.PODDetail.OrderItemRate);
  }

  handleRateChange = (e) => {
    !isNaN(e.value) && e.value > 0 ? this.calculateItemAmount() : (this.PODDetail.Amount = null);
  };

  handleRateUOMChange = (e) => {
    e.value && this.PODDetail.OrderItemRate > 0 ? this.calculateItemAmount() : (this.PODDetail.Amount = null);
  };
  commissionFieldenabled() {
    this.SalesManAgentStatus = false;
    this.CommTypeStatus = false;
    this.CommRateStatus = false;
    this.CommRateUomStatus = false;
  }

  editDetailRecordRow(editObject, index) {
    this.detailEditMode = true;
    this.updateRowIndex = index;
    // this.PODDetail = editObject;
    this.PODDetail.ItemName = editObject.ItemName;
    this.PODDetail.OrderItemId = editObject.OrderItemId;
    this.PODDetail.OrderItemUOMId = editObject.OrderItemUOMId;
    this.PODDetail.OrderItemQty = editObject.OrderItemQty;
    this.PODDetail.NetWeight = editObject.NetWeight;
    this.PODDetail.OrderItemRate = editObject.OrderItemRate;
    this.PODDetail.OrderItemRateUOMId = editObject.OrderItemRateUOMId;
    this.PODDetail.Amount = editObject.Amount;
    this.PODDetail.JobLotId = editObject.JobLotId;
    this.PODDetail.Crop = editObject.Crop;
    this.PODDetail.OrderRemarks = editObject.OrderRemarks;
    this.PODDetail.UOMDescription = editObject.UOMDescription;
    this.PODDetail.EquivalentRate = editObject.EquivalentRate;
    this.PODDetail.JobLotDescription = editObject.JobLotDescription;
    this.PODDetail.BagPrice = editObject.BagPrice;
    this.PODDetail.BagWeight = editObject.BagWeight;
    this.PODDetail.LabSampleNo = editObject.LabSampleNo;
    this.PODDetail.Moisture = editObject.Moisture;
  }

  deleteDetailRecordRow(index) {
    this.dataSource.splice(index, 1);
  }

  addDetailRecord2Grid() {
    if (validate(this.POFDetail)) {
      this.PODDetail.ItemName = this.POFDetail.instance.getEditor("OrderItemId").option("text");
      this.PODDetail.UOMDescription = this.POFDetail.instance.getEditor("OrderItemUOMId").option("text");
      this.PODDetail.JobLotDescription = this.POFDetail.instance.getEditor("JobLotId").option("text");
      this.PODDetail.EquivalentRate = this.POFDetail.instance.getEditor("OrderItemRateUOMId").option("text");
      for (let i = 0; i < this.dataSource.length; i++) {
        if (this.PODDetail.OrderItemId == this.dataSource[i].OrderItemId) {
          notify("Item Already Exist in Detail Grid", "Error");
          return;
        }
      }
      if (this.updateRowIndex >= 0) {
        this.dataSource[this.updateRowIndex] = this.PODDetail;
        this.updateRowIndex = -1;
        this.detailEditMode = false;
      } else {
        this.dataSource.push(this.PODDetail);
        if (this.dataSource.length) {
          this.commissionFieldenabled();
        }
      }

      this.dataGrid.instance.refresh();
      this.POFDetail.instance.getEditor("OrderItemId").focus();
      this.PODDetail = new PurchaseOrderDetail();
    }
    this.handleCommissionAmountChange(null);
  }

  resetForm() {
    this.initForm();
    this.dataSource = new Array<DataSourceDTO>();
    this.detailEditMode = false;
    this.purchaseOrderParamsId = null;
    this.id4submit = null;
    ["OrderCatagoryId", "CatagorySrNo", "DocNo", "OrderSupCustId", "SupplierRefNo", "PaymentTermsId", "OrderDueDays", "PaymentTermsId", "RemarksHeader", "DeliveryDays"].map((field) =>
      this.POF.instance.getEditor(field).reset()
    );
    // let CatagoryId = this.orderCatagoryId;
    // this.POD.OrderCatagoryId = CatagoryId;
    this.orderCatagoryId = null;
    // this.getCategorySerialNo(CatagoryId);
    this.POD.OrderDueDate = new Date();
    this.POD.OrderExpiryDate = new Date();
    this.POD.DeliveryStartDate = new Date();
    this.getDocumentNo();
    this.POF.instance.getEditor("OrderCatagoryId").focus();
  }

  handleCancel() {}
  userRights() {
    this.commonService
      .userRights({
        UserId: this.commonService.UserId(),
        ScreenName: "SaleOrder",
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
    if (this.purchaseOrderParamsId > 0) {
      if (this.canUpdate) {
        this.handleSave();
      } else {
        notify("You don't have right to update", "error");
        return;
      }
    } else {
      if (this.canSave) {
        this.handleSave();
      } else {
        notify("You don't have right to save", "error");
        return;
      }
    }
  }

  handleSave() {
    if (validate(this.POF)) {
      if (this.dataSource.length > 0 == false) {
        alert("Please Add detail record");
      } else {
        this.POD.Id = this.id4submit;
        this.POD.DocumentTypeId = 81;
        this.POD.CompanyId = this.companyId;
        this.POD.OrganizationId = this.organizationId;
        this.POD.EntryUser = this.commonService.UserId();
        this.POD.EntryDate = this.currentDate;
        this.POD.ModifyUser = this.commonService.UserId();
        this.POD.ModifyDate = this.currentDate;
        // this.POD.PostUser = this.commonService.UserId();
        // this.POD.PostDate = this.currentDate;
        // this.POD.PostState = false;
        this.POD.SaleOrderDetailList = this.dataSource;

        this.service.savePurchaseOrder(this.POD).subscribe(
          (result) => {
            this.purchaseOrderParamsId ? notify("Record updated successfully", "success") : notify("Record saved successfully!", "success");
            this.dataSource.length = 0;
            this.router.navigate([], { queryParams: { Id: null } });
            this.resetForm();
          },
          (error) => console.log(error)
        );
      }
    }
  }
}
