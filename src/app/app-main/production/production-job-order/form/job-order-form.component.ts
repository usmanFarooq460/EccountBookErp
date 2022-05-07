import { Component, OnInit, ViewChild } from "@angular/core";
import { DxFormComponent, DxDataGridComponent, DxTabPanelComponent } from "devextreme-angular";
import { ProductionJobOrderModel, FilterModel, ProductionJobOrderOutputModel, ProductionJobOrderInputModel } from "../production-job-order.model";
import { ProductionJobOrderService } from "../production-job-order.service";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { ActivatedRoute, Router } from "@angular/router";
import { validate } from "src/app/shared/Base/validationHelper";
import notify from "devextreme/ui/notify";

@Component({
  selector: "app-production-job-order",
  templateUrl: "./job-order-form.component.html",
  styles: [],
})
export class ProductionJobOrderFormComponent implements OnInit {
  @ViewChild("productionJobOrderForm", { static: false })
  productionJobOrderForm: DxFormComponent;
  productionJobOrderFormData: ProductionJobOrderModel;

  @ViewChild("FilterDataForDetailForm", { static: false })
  FilterDataForDetailForm: DxFormComponent;
  FilterDataForDetailFormData: FilterModel;

  @ViewChild("productionJobOrderDetailInputForm", { static: false })
  productionJobOrderDetailInputForm: DxFormComponent;
  productionJobOrderDetailInputFormData: ProductionJobOrderInputModel;

  @ViewChild("productionJobOrderDetailOutputForm", { static: false })
  productionJobOrderDetailOutputForm: DxFormComponent;
  productionJobOrderDetailOutputFormData: ProductionJobOrderOutputModel;

  @ViewChild("productionDetailTabPanel", { static: false })
  productionDetailTabPanel: DxTabPanelComponent;

  @ViewChild("DetailInputGrid", { static: false })
  DetailInputGrid: DxDataGridComponent;
  @ViewChild("DetailOuputGrid", { static: false })
  DetailOuputGrid: DxDataGridComponent;

  //#region ConditionalVariables
  detailEditMode: boolean;
  updateRowIndex: number;
  productionJobOrderParamsId: number;
  warningPopupVisibility: boolean = false;
  message: string;
  id4submit: number;
  canSave: boolean;
  canUpdate: boolean;
  canPrint: boolean;
  //#endregion
  //#region DataListVariables
  plant_feaderList = [];
  planTypeList = [
    { Id: 1, Type: "Local" },
    { Id: 2, Type: "Export" },
    { Id: 3, Type: "Party" },
  ];
  entryTypeList = [
    { Id: 1, Label: "Input" },
    { Id: 2, Label: "Output" },
  ];

  itemList = [];
  bagTypeList = [];
  cropYearList = [];
  jobLotList = [];
  warehouseList = [];
  inputDataSource = [];
  outputDataSource = [];
  filterTypeList = [
    { Id: 2, name: "Export Contract" },
    { Id: 3, name: "Item Type" },
    { Id: 4, name: "Item Category" },
  ];
  productionTypeList = [
    { Id: 1, ProductionType: "Husking" },
    { Id: 2, ProductionType: "Processing" },
    { Id: 3, ProductionType: "Other" },
  ];
  productionPlanStatusList = [
    { Id: 1, Status: "In Process" },
    { Id: 1, Status: "Complete" },
    { Id: 1, Status: "Cancel" },
  ];
  accountsList = [];
  filteredResultList = [];
  uomList = [];
  itemListForDetail = [];
  branchList = [];
  projectList = [];
  //#endregion
  constructor(private service: ProductionJobOrderService, private commonService: CommonBaseService, private route: ActivatedRoute, private router: Router) {}

  async ngOnInit() {
    this.productionJobOrderParamsId = this.route.snapshot.queryParams["Id"];
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.userRights();
    this.GetAllItems();
    this.getBagType();
    this.getJobLot();
    this.plantFeaderGetAll();
    this.getWarehouse();
    this.GetAllAccountsList();
    this.getCropYear();
    this.initForm();
  }

  initForm() {
    if (this.productionJobOrderParamsId > 0 == false) {
      this.generateDocNo();
    }

    this.productionJobOrderFormData = new ProductionJobOrderModel();
    this.FilterDataForDetailFormData = new FilterModel();
    this.productionJobOrderDetailInputFormData = new ProductionJobOrderInputModel();
    this.productionJobOrderDetailOutputFormData = new ProductionJobOrderOutputModel();
    this.productionJobOrderFormData.PlanDate = new Date();
    this.productionJobOrderFormData.BranchesId = this.branchList[0].Id;
    this.productionJobOrderFormData.ProjectsId = this.projectList[0].Id;
    this.detailEditMode = false;
    this.updateRowIndex = -1;
    if (this.productionJobOrderParamsId > 0) {
      this.setFields4editMode();
    }
  }

  setFields4editMode() {
    !isNaN(this.productionJobOrderParamsId)
      ? ((this.id4submit = this.productionJobOrderParamsId),
        this.service.GetByID(this.productionJobOrderParamsId).subscribe(
          (result: any) => {
            this.productionJobOrderFormData = result;
            this.inputDataSource = result.invProductionJobOrderInput;
            this.outputDataSource = result.invProductionJobOrderOutput;
          },
          (error) => console.log(error)
        ))
      : (this.id4submit = null);
  }

  //#region ComboFill
  generateDocNo() {
    this.service
      .getDocNo({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.productionJobOrderFormData.PlanCode = result;
        },
        (error) => {}
      );
  }

  generatePlantTypeSrNo = (e) => {
    if (this.productionJobOrderParamsId > 0 == false) {
      this.service
        .getPlanTypeSrNo({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          PlanType: e.value,
        })
        .subscribe(
          (result) => {
            this.productionJobOrderFormData.PlanTypeSrNo = result;
          },
          (error) => {
            console.log(error);
          }
        );
    }
  };

  plantFeaderGetAll() {
    this.service
      .getPlantFeader({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.plant_feaderList = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getBagType() {
    this.service.getBagType().subscribe(
      (result) => (this.bagTypeList = result),
      (error) => console.log(error)
    );
  }

  GetAllItems() {
    this.service
      .getAllItems({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.itemList = result;
          this.itemListForDetail = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getJobLot() {
    this.service
      .getJobLot({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => (this.jobLotList = result),
        (error) => console.log(error)
      );
  }
  getWarehouse() {
    this.service
      .getWareHouse({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => (this.warehouseList = result),
        (error) => console.log(error)
      );
  }
  getUOM = (e) => {
    this.service
      .getUOM({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        ItemId: e.value,
      })
      .subscribe(
        (result) => {
          this.uomList = result;
        },
        (error) => console.log(error)
      );
  };
  //#region
  userRights() {
    this.commonService
      .userRights({
        UserId: this.commonService.UserId(),
        ScreenName: "frmProductionJobOrder",
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
  //#endregion

  getCropYear() {
    this.service
      .getCropYear({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => (this.cropYearList = result),
        (error) => console.log(error)
      );
  }

  GetAllAccountsList() {
    this.service
      .getAccounts({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.accountsList = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getItemsByExportContract(e) {
    this.service
      .getItemByExportContract({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        Id: e,
      })
      .subscribe(
        (result) => {
          this.itemListForDetail = [];
          for (let i = 0; i < result.length; i++) {
            this.itemListForDetail.push({
              Id: result[i].ExImItemId,
              ItemName: result[i].ItemName,
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getExportContractNo() {
    this.service.getExportContract({}).subscribe(
      (result) => {
        this.filteredResultList = [];
        for (let i = 0; i < result.length; i++) {
          this.filteredResultList.push({
            valueExpression: result[i].Id,
            displayExpression: result[i].LcOrderNo,
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getItemTypes() {
    this.service
      .getItemType({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.filteredResultList = [];
          for (let i = 0; i < result.length; i++) {
            this.filteredResultList.push({
              valueExpression: result[i].Id,
              displayExpression: result[i].TypeDescription,
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getItemCategory() {
    this.service
      .getItemCategory({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.filteredResultList = [];
          for (let i = 0; i < result.length; i++) {
            this.filteredResultList.push({
              valueExpression: result[i].Id,
              displayExpression: result[i].CategoryDescription,
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  //#endregion

  //#region OnComboValueChagedEvents
  handleEntryTypeChanged = (e) => {
    if (e.value == "Input") {
      this.productionDetailTabPanel.instance.option("selectedIndex", 0);
    } else {
      this.productionDetailTabPanel.instance.option("selectedIndex", 1);
    }
    this.filteredResultList = [];
  };
  handleWeightCalculationInInput = (e) => {
    let netWeightInInput = 0;
    let qtyInput = parseInt(this.productionJobOrderDetailInputForm.instance.getEditor("Qty").option("text"));
    let packSizeInput = parseInt(this.productionJobOrderDetailInputForm.instance.getEditor("UomSchIdQty").option("text"));
    if (qtyInput > 0 && packSizeInput > 0) {
      netWeightInInput = qtyInput * packSizeInput;
      this.productionJobOrderDetailInputFormData.NetWeight = parseInt(netWeightInInput.toFixed(2));
    }
  };

  handleWeightCalculationInOutput = (e) => {
    let netWeightInOutput = 0;

    let qtyOutput = parseInt(this.productionJobOrderDetailOutputForm.instance.getEditor("QtyOuter").option("text"));

    let packSizeOuput = parseInt(this.productionJobOrderDetailOutputForm.instance.getEditor("UomSchIdOuter").option("text"));

    if (qtyOutput > 0 && packSizeOuput > 0) {
      netWeightInOutput = qtyOutput * packSizeOuput;
      this.productionJobOrderDetailOutputFormData.NetWeight = parseInt(netWeightInOutput.toFixed(2));
    }
  };

  //#endregion

  //#region Pushing Detail Records in Data Grdi
  addDetailRecordInInputGrid() {
    if (validate(this.productionJobOrderDetailInputForm)) {
      this.productionJobOrderDetailInputFormData.ItemName = this.productionJobOrderDetailInputForm.instance.getEditor("ItemId").option("text");
      this.productionJobOrderDetailInputFormData.PackingType = this.productionJobOrderDetailInputForm.instance.getEditor("PackingTypeId").option("text");

      this.productionJobOrderDetailInputFormData.UOMCode = this.productionJobOrderDetailInputForm.instance.getEditor("UomSchIdQty").option("text");
      this.productionJobOrderDetailInputFormData.BatchCrop = this.productionJobOrderDetailInputForm.instance.getEditor("CropYearId").option("text");
      this.productionJobOrderDetailInputFormData.JobLotCode = this.productionJobOrderDetailInputForm.instance.getEditor("JobLotId").option("text");
      this.productionJobOrderDetailInputFormData.WareHouseName = this.productionJobOrderDetailInputForm.instance.getEditor("WarehouseId").option("text");

      if (this.updateRowIndex >= 0) {
        this.inputDataSource[this.updateRowIndex] = this.productionJobOrderDetailInputFormData;
        this.updateRowIndex = -1;
        this.detailEditMode = false;
      } else {
        this.inputDataSource.push(this.productionJobOrderDetailInputFormData);
      }
      this.productionJobOrderDetailInputFormData = new ProductionJobOrderInputModel();
      this.productionJobOrderDetailInputForm.instance.getEditor("ItemId").focus();
    }
  }

  addDetailRecordInOutputGrid() {
    if (validate(this.productionJobOrderDetailOutputForm)) {
      this.productionJobOrderDetailOutputFormData.ItemName = this.productionJobOrderDetailOutputForm.instance.getEditor("ItemId").option("text");
      this.productionJobOrderDetailOutputFormData.PackTypeDesc = this.productionJobOrderDetailOutputForm.instance.getEditor("InvPackingTypeId").option("text");

      this.productionJobOrderDetailOutputFormData.InnerUomCode = this.productionJobOrderDetailOutputForm.instance.getEditor("UomSchIdInner").option("text");
      this.productionJobOrderDetailOutputFormData.outerUOMCode = this.productionJobOrderDetailOutputForm.instance.getEditor("UomSchIdOuter").option("text");
      this.productionJobOrderDetailOutputFormData.CropYear = this.productionJobOrderDetailOutputForm.instance.getEditor("CropYearId").option("text");
      this.productionJobOrderDetailOutputFormData.JobLotDescription = this.productionJobOrderDetailOutputForm.instance.getEditor("JobLotId").option("text");
      this.productionJobOrderDetailOutputFormData.WareHouseName = this.productionJobOrderDetailOutputForm.instance.getEditor("WarehouseId").option("text");

      if (this.updateRowIndex >= 0) {
        this.outputDataSource[this.updateRowIndex] = this.productionJobOrderDetailOutputFormData;
        this.updateRowIndex = -1;
        this.detailEditMode = false;
      } else {
        this.outputDataSource.push(this.productionJobOrderDetailOutputFormData);
      }
      this.productionJobOrderDetailOutputFormData = new ProductionJobOrderOutputModel();
      this.productionJobOrderDetailOutputForm.instance.getEditor("ItemId").focus();
    }
  }

  //#endregion
  //#region FilterForm
  handleFilterTypeChange = (e) => {
    if (e.value == "Export Contract") {
      this.getExportContractNo();
    } else if (e.value == "Item Type") {
      this.getItemTypes();
    } else if (e.value == "Item Category") {
      this.getItemCategory();
    } else {
      this.filteredResultList = [];
    }
  };
  handleFilteredResultChange = (e) => {
    if (this.FilterDataForDetailFormData.EntryType == "Input") {
      if (this.FilterDataForDetailFormData.filterType == "Item Category" && e.value > 0) {
        this.itemListForDetail = this.itemList.filter(({ ItemCategoryId }) => ItemCategoryId == e.value);
      } else if (this.FilterDataForDetailFormData.filterType == "Item Type" && e.value > 0) {
        this.itemListForDetail = this.itemList.filter(({ ItemTypeId }) => ItemTypeId == e.value);
      } else if (this.FilterDataForDetailFormData.filterType == "Export Contract" && e.value > 0) {
        this.getItemsByExportContract(e.value);
      } else if (e.value > 0 == false) {
        this.itemListForDetail = this.itemList;
      }
    } else if (this.FilterDataForDetailFormData.EntryType == "Output") {
      if (this.FilterDataForDetailFormData.filterType == "Item Category" && e.value > 0) {
        this.itemListForDetail = this.itemList.filter(({ ItemCategoryId }) => ItemCategoryId == e.value);
      } else if (this.FilterDataForDetailFormData.filterType == "Item Type" && e.value > 0) {
        this.itemListForDetail = this.itemList.filter(({ ItemTypeId }) => ItemTypeId == e.value);
      } else if (this.FilterDataForDetailFormData.filterType == "Export Contract" && e.value > 0) {
        this.getItemsByExportContract(e.value);
      } else if (e.value > 0 == false) {
        this.itemListForDetail = this.itemList;
      }
    } else {
      this.message = "Please Select Entry Type";
      this.warningPopupVisibility = true;
      return;
    }
  };

  //#endregion
  //#region MiniMethods
  editOutputDetailRecord(data, index) {
    this.detailEditMode = true;
    this.updateRowIndex = index;
    this.productionJobOrderDetailOutputFormData = data;
  }

  editInputDetailRecord(data, index) {
    this.detailEditMode = true;
    this.updateRowIndex = index;
    this.productionJobOrderDetailInputFormData = data;
  }

  deleteOutputDetailRow(data, index) {
    this.outputDataSource.splice(index, 1);
  }
  deleteInputDetailRow(data, index) {
    this.inputDataSource.splice(index, 1);
  }
  checkClick(e) {
    if (e == "false") {
      this.warningPopupVisibility = false;
    }
  }

  //#endregion
  resetForm() {
    this.inputDataSource = [];
    this.outputDataSource = [];
    this.productionJobOrderParamsId = 0;
    this.detailEditMode = false;
    this.initForm();
    this.productionJobOrderForm.instance.getEditor("PlanType").focus();
  }

  onSave() {
    if (this.productionJobOrderParamsId > 0) {
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
    if (validate(this.productionJobOrderForm)) {
      if (this.inputDataSource.length > 0 == false) {
        this.message = "Input Detail Data Not Found!";
        this.warningPopupVisibility = true;
        return;
      } else if (this.outputDataSource.length > 0 == false) {
        this.message = "Output Detail Data Not Found!";
        this.warningPopupVisibility = true;
        return;
      }

      this.productionJobOrderFormData.Id = this.productionJobOrderParamsId;

      this.productionJobOrderFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.productionJobOrderFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.productionJobOrderFormData.EntryDate = new Date();
      this.productionJobOrderFormData.ModifyDate = new Date();
      this.productionJobOrderFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.productionJobOrderFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.productionJobOrderFormData.DocumentTypeId = 401;

      this.productionJobOrderFormData.invProductionJobOrderInput = this.inputDataSource;
      this.productionJobOrderFormData.invProductionJobOrderOutput = this.outputDataSource;
      this.service.Save(this.productionJobOrderFormData).subscribe(
        (result) => {
          this.productionJobOrderParamsId ? notify("Record updated successfully", "success") : notify("Record saved successfully!", "success");
          this.router.navigate([], { queryParams: { Id: null } });
          this.resetForm();
        },
        (error) => console.log(error)
      );
    }
  }
}
