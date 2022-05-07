import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { DxFormComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { validate } from "src/app/shared/Base/validationHelper";
import { invFoodProductionDetailModel, invFoodProductionModel } from "../inv-food-production.model";
import { InvFoodProductionService } from "../inv-food-production.service";

@Component({
  selector: "inv-food-production-output-form",
  templateUrl: "./inv-food-production-output-form.component.html",
  styleUrls: [],
})
export class InvFoodProductionOutputFormComponent extends BaseActions implements OnInit {
  @ViewChild("OutputForm", { static: false })
  OutputForm: DxFormComponent;
  OutputFormData: invFoodProductionModel;
  @ViewChild("OutputDetailForm", { static: false })
  OutputDetailForm: DxFormComponent;
  OutputDetailFormData: invFoodProductionDetailModel;

  EntryTypeList = [
    { Id: 1, label: "ByProduct" },
    { Id: 2, label: "FinishGoods" },
  ];
  jobOrderList = [];
  WipAccountList = [];
  WipItemList = [];
  itemsList: any;
  UOMListByItemId = [];
  cropYearList = [];
  jobLotList = [];
  packTypeList = [];
  detailDataSource = [];
  stockAccountlist: any;
  wareHouseList = [];
  branchesList = [];
  projectList = [];
  FinishGoodsAverageRate: number;
  inputQty: number;
  inputWeight: number;
  updateRowIndex: number;

  showHideLoaderPopup: boolean;
  rateReadOnlyOnFinishGoodsSelection: boolean;
  detailEditMode: boolean;

  @Output() isSubmitted = new EventEmitter();

  constructor(private commonMethods: CommonMethodsForCombos, private commonService: CommonBaseService, private service: InvFoodProductionService) {
    super();
  }

  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("FoodProductionWithValues"));
    await this.FetchData();
    this.initForm();
  }

  async FetchData() {
    this.ActivateLoadPanel("Fetching Data For Form Feilds");
    this.branchesList = await this.commonService.getBranch().catch((err) => console.log(err));
    this.projectList = await this.commonService.getProject().catch((err) => console.log(err));
    this.jobOrderList = await this.getAllProductionJobOrder().catch((err) => console.log(err));
    this.itemsList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetItemsForComboBind().catch((err) => console.log(err)));
    this.cropYearList = await this.commonMethods.CropYear().catch((err) => console.log(err));
    this.jobLotList = await this.commonMethods.getJobLot().catch((err) => console.log(err));
    this.packTypeList = await this.commonMethods.GetAllPackingTypes().catch((err) => console.log(err));
    this.stockAccountlist = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetAllCoaAllocations().catch((err) => console.log("")));
    // console.log("Stock Acocunts List: ", this.stockAccountlist);
    this.wareHouseList = await this.commonMethods.getWareHouse().catch((err) => console.log(err));
    this.DeActivateLoadPanel();
  }

  async initForm() {
    this.OutputFormData = new invFoodProductionModel();
    this.OutputDetailFormData = new invFoodProductionDetailModel();
    this.OutputFormData.DocDate = new Date();
    if (this.OutputFormData.Id > 0 == false) {
      this.OutputFormData.DocCode = await this.GetSerialNumberForInvFoodProdcutionInput();
    }
    this.OutputForm.instance.getEditor("InvJobOrderId").focus();
  }

  setFieldsForEdit(Id) {
    this.service.GetByID(Id).subscribe(
      (resp: invFoodProductionModel) => {
        this.OutputFormData = resp;
        this.detailDataSource = resp.invFoodProductionDetails;
      },
      (error) => {
        this.HandleError(error);
      }
    );
  }

  async GetSerialNumberForInvFoodProdcutionInput() {
    return await this.service
      .GetSerialNumberForInvFoodProdcution({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 112,
      })
      .catch((err) => this.HandleError(err));
  }

  async getAllProductionJobOrder() {
    return await this.service
      .GetJobOrderNoForInvFoodProduction({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 403,
      })
      .catch((err) => this.HandleError(err));
  }

  onJobOrderLeaveGetWipItemAndAccount = (e) => {
    if (e.value > 0 == false) {
      this.WipAccountList = [];
      this.WipItemList = [];
    } else {
      this.getGlAccountsOnJobOrderLeave(e.value);
      this.getInputQtyAndWeightOnJobOrderLewave(e.value);
    }
  };

  getInputQtyAndWeightOnJobOrderLewave(jobOrderId) {
    this.service
      .GetInPutTotalQtyandWeightByJobOrderId({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        InvJobOrderId: jobOrderId,
      })
      .subscribe(
        (resp) => {
          this.inputQty = resp[0]?.ItemQty;
          this.inputWeight = resp[0]?.StockWeight;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  getGlAccountsOnJobOrderLeave(jobOrderId) {
    this.service
      .GetGlAccountsByJobOrderId({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        Id: jobOrderId,
      })
      .subscribe(
        (resp) => {
          if (resp?.length > 0) {
            this.WipAccountList = [];
            this.WipItemList = [];
            this.WipAccountList.push({
              Id: resp[0].WorkInProccessAcId,
              WorkInProcessAc: resp[0].WorkInProcessAc,
            });

            this.WipItemList.push({
              Id: resp[0].WipItemId,
              ItemName: resp[0].ItemName,
            });
            this.OutputFormData.WIPAccountId = this.WipAccountList[0].Id;
            this.OutputFormData.WIPItemId = this.WipItemList[0].Id;
            this.OutputDetailFormData.StockAcId = resp[0].ByProductacId;
            this.FinishGoodsAverageRate = resp[0]?.FinishGoodRate;
            if (this.OutputDetailFormData.EntryType == "FinishGoods") {
              this.OutputDetailFormData.Rate = resp[0]?.FinishGoodRate;
            }
          }
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  onEntryTypeChange = (e) => {
    if (e.value == "FinishGoods") {
      this.OutputDetailFormData.Rate = this.FinishGoodsAverageRate;
      this.rateReadOnlyOnFinishGoodsSelection = true;
    } else {
      this.rateReadOnlyOnFinishGoodsSelection = false;
    }
  };

  onItemValueChange = async (e) => {
    this.UOMListByItemId = await this.commonMethods.getUOM(e.value);
  };

  calculationsInDetailForm = (e) => {
    let UOM = parseFloat(this.OutputDetailForm.instance.getEditor("ItemUomId").option("text")) > 0 ? parseFloat(this.OutputDetailForm.instance.getEditor("ItemUomId").option("text")) : 0;
    let qty = this.OutputDetailFormData.Qty > 0 ? this.OutputDetailFormData.Qty : 0;
    let rate = this.OutputDetailFormData.Rate > 0 ? this.OutputDetailFormData.Rate : 0;
    let rateUom = parseFloat(this.OutputDetailForm.instance.getEditor("RateUOMId").option("text")) > 0 ? parseFloat(this.OutputDetailForm.instance.getEditor("RateUOMId").option("text")) : 0;
    let billWeight = this.OutputDetailFormData.Weight > 0 ? this.OutputDetailFormData.Weight : 0;
    if (qty > 0 && UOM > 0) this.OutputDetailFormData.Weight = UOM * qty;
    let amount = 0;
    if (rateUom > 0) {
      amount = (billWeight / rateUom) * rate;
      this.OutputDetailFormData.Amount = parseFloat(amount.toFixed(2));
    }
  };

  addDetailRecord2Grid() {
    if (validate(this.OutputDetailForm)) {
      this.OutputDetailFormData.ItemName = this.OutputDetailForm.instance.getEditor("ItemId").option("text");
      this.OutputDetailFormData.Equivalent = this.OutputDetailForm.instance.getEditor("ItemUomId").option("text");
      this.OutputDetailFormData.JobLotDescription = this.OutputDetailForm.instance.getEditor("JobLotId").option("text");
      this.OutputDetailFormData.PackTypeDesc = this.OutputDetailForm.instance.getEditor("PackingtypeId").option("text");
      this.OutputDetailFormData.RateUOM = parseFloat(this.OutputDetailForm.instance.getEditor("RateUOMId").option("text"));
      this.OutputDetailFormData.WareHouseName = this.OutputDetailForm.instance.getEditor("WarehouseId").option("text");
      this.OutputDetailFormData.JobLotCode = this.OutputDetailForm.instance.getEditor("JobLotId").option("text");
      this.OutputDetailFormData.PackTypeCode = this.OutputDetailForm.instance.getEditor("PackingtypeId").option("text");
      this.OutputDetailFormData.IssueWeight = this.OutputDetailFormData.Weight;

      if (this.detailEditMode) {
        this.detailDataSource[this.updateRowIndex] = this.OutputDetailFormData;
        this.detailEditMode = false;
        this.updateRowIndex = -1;
      } else {
        this.detailDataSource.push(this.OutputDetailFormData);
      }
      this.OutputDetailFormData = new invFoodProductionDetailModel();
      this.OutputDetailForm.instance.getEditor("ItemId").focus();
    }
  }
  editDetailRecordRow(editObject, index) {
    this.detailEditMode = true;
    this.updateRowIndex = index;
    this.OutputDetailFormData = editObject;
  }

  deleteDetailRecordRow(index) {
    this.detailDataSource.splice(index, 1);
  }

  resetForm() {
    this.detailDataSource = [];
    this.inputQty = null;
    this.inputWeight = null;
    this.initForm();
  }

  onSAveButtonClicked() {
    if (this.OutputFormData.Id > 0) {
      if (this.UserRightsObject.canUpdate) {
        this.onSave();
      } else {
        this.ErrorPopup("You dont have right to update");
      }
    } else {
      if (this.UserRightsObject.canSave) {
        this.onSave();
      } else {
        this.ErrorPopup("You dont have Right to Save");
      }
    }
  }

  onSave() {
    if (validate(this.OutputForm)) {
      if (this.detailDataSource?.length > 0 == false) {
        this.WarningPopup("Detail Data Not Found!  Please Add Record in Detali to Proceed");
        return;
      }
      this.OutputFormData.EntryDate = new Date();
      this.OutputFormData.ModifyDate = new Date();
      this.OutputFormData.BranchId = this.branchesList[0].Id;
      this.OutputFormData.ProjectId = this.projectList[0].Id;
      this.OutputFormData.DocumentTypeId = 112;
      this.OutputFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.OutputFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.OutputFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.OutputFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.OutputFormData.InvJobOrderNo = this.OutputForm.instance.getEditor("InvJobOrderId").option("text");
      this.OutputFormData.invFoodProductionDetails = this.detailDataSource;
      this.OutputFormData.EntryType = "Output";
      this.OutputFormData.Id > 0 ? this.ActivateLoadPanel("Updating!") : this.ActivateLoadPanel("Saving!");
      this.service.Save(this.OutputFormData).subscribe(
        (resp) => {
          this.OutputFormData.Id > 0 ? this.SuccessPopup("Record Updated Successfully") : this.SuccessPopup("Record Saved Successfully");
          this.DeActivateLoadPanel();
          this.resetForm();
          this.isSubmitted.emit("true");
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
