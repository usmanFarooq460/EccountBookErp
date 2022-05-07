import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { DxFormComponent } from "devextreme-angular";
import { CommonFormsCollectionForHeperlinksComponent } from "src/app/app-main/common-forms-collection-for-heperlinks/common-forms-collection-for-heperlinks/common-forms-collection-for-heperlinks.component";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { validate } from "src/app/shared/Base/validationHelper";
import { invFoodProductionDetailModel, invFoodProductionModel } from "../inv-food-production.model";
import { InvFoodProductionService } from "../inv-food-production.service";

@Component({
  selector: "app-inv-food-production-input-form",
  templateUrl: "./inv-food-production-input-form.component.html",
  styleUrls: [],
})
export class InvFoodProductionInputFormComponent extends BaseActions implements OnInit {
  @ViewChild("invFoodProductionInputForm", { static: false })
  invFoodProductionInputForm: DxFormComponent;
  invFoodProductionInputFormData: invFoodProductionModel;
  @ViewChild("invFoodProductionInputDetailForm", { static: false })
  invFoodProductionInputDetailForm: DxFormComponent;
  invFoodProductionInputDetailFormData: invFoodProductionDetailModel;

  jobOrderList = [];
  WipAccountList = [];
  WipItemList = [];
  itemsList: any;
  UOMListByItemId = [];
  cropYearList = [];
  jobLotList = [];
  packTypeList = [];
  detailDataSource = [];
  wareHouseList = [];
  branchesList = [];
  projectList = [];
  updateRowIndex: number;
  BalanceWeight = 0;
  BalanceQty = 0;
  selectedIndex = 0;

  showHideLoaderPopup: boolean;
  detailEditMode: boolean;

  @Output() isSubmitted = new EventEmitter();
  @Output() closeClicked = new EventEmitter();

  constructor(private commonMethods: CommonMethodsForCombos, private service: InvFoodProductionService, private commonService: CommonBaseService) {
    super();
  }

  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("FoodProductionWithValues"));
    await this.FetchData();
    this.initForm();
  }

  async FetchData() {
    this.ActivateLoadPanel("Fetching Data For Form Feilds");
    this.branchesList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.jobOrderList = await this.getAllProductionJobOrder().catch((err) => console.log(err));
    this.itemsList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetItemsForComboBind().catch((err) => console.log(err)));
    this.cropYearList = await this.commonMethods.CropYear().catch((err) => console.log(err));
    this.jobLotList = await this.commonMethods.getJobLot().catch((err) => console.log(err));
    this.packTypeList = await this.commonMethods.GetAllPackingTypes().catch((err) => console.log(err));
    this.wareHouseList = await this.commonMethods.getWareHouse().catch((err) => console.log(err));
    this.DeActivateLoadPanel();
  }

  async initForm() {
    this.invFoodProductionInputFormData = new invFoodProductionModel();
    this.invFoodProductionInputDetailFormData = new invFoodProductionDetailModel();
    this.invFoodProductionInputFormData.DocDate = new Date();
    if (this.invFoodProductionInputFormData.Id > 0 == false) {
      this.invFoodProductionInputFormData.DocCode = await this.GetSerialNumberForInvFoodProdcutionInput();
    }
    this.invFoodProductionInputForm.instance.getEditor("InvJobOrderId").focus();
  }

  setFieldsForEdit(Id) {
    this.ActivateLoadPanel("Setting Form Fields For Edit");
    this.service.GetByID(Id).subscribe(
      (resp: invFoodProductionModel) => {
        this.DeActivateLoadPanel();
        this.invFoodProductionInputFormData = resp;
        this.detailDataSource = resp.invFoodProductionDetails;
      },
      (error) => {
        this.DeActivateLoadPanel();
        this.HandleError(error);
      }
    );
  }

  resetForm() {
    this.detailDataSource = [];
    this.initForm();
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

  async GetSerialNumberForInvFoodProdcutionInput() {
    return await this.service
      .GetSerialNumberForInvFoodProdcution({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 80,
      })
      .catch((err) => this.HandleError(err));
  }

  getWipItemAndAccount = (e) => {
    if (e.value > 0 == false) {
      this.WipAccountList = [];
      this.WipItemList = [];
    }
    this.service
      .GetGlAccountsByJobOrderId({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        Id: e.value,
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
            this.invFoodProductionInputFormData.WIPAccountId = this.WipAccountList[0].Id;
            this.invFoodProductionInputFormData.WIPItemId = this.WipItemList[0].Id;
          }
        },
        (error) => {
          this.HandleError(error);
        }
      );
  };

  onItemValueChange = async (e) => {
    if (e.value) {
      this.UOMListByItemId = await this.commonMethods.getUOM(e.value);
      this.service
        .getAverageRateOnItemLeave({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          ItemId: e.value,
          DocDate: new Date(),
        })
        .subscribe(
          (resp) => {
            this.invFoodProductionInputDetailFormData.Rate = resp[0]?.AvgRate;
            this.invFoodProductionInputDetailFormData.balanceQty = resp[0]?.QtyInHand;
            this.invFoodProductionInputDetailFormData.balanceWeight = resp[0]?.StockInHand;
          },
          (error) => {
            this.HandleError(error);
          }
        );
    }
  };

  calculationsInDetailForm = (e) => {
    let UOM =
      parseFloat(this.invFoodProductionInputDetailForm.instance.getEditor("ItemUomId").option("text")) > 0
        ? parseFloat(this.invFoodProductionInputDetailForm.instance.getEditor("ItemUomId").option("text"))
        : 0;

    let qty = this.invFoodProductionInputDetailFormData.Qty > 0 ? this.invFoodProductionInputDetailFormData.Qty : 0;
    let rate = this.invFoodProductionInputDetailFormData.Rate > 0 ? this.invFoodProductionInputDetailFormData.Rate : 0;
    let rateUom =
      parseFloat(this.invFoodProductionInputDetailForm.instance.getEditor("RateUOMId").option("text")) > 0
        ? parseFloat(this.invFoodProductionInputDetailForm.instance.getEditor("RateUOMId").option("text"))
        : 0;
    let billWeight = this.invFoodProductionInputDetailFormData.Weight > 0 ? this.invFoodProductionInputDetailFormData.Weight : 0;
    if (qty > 0 && UOM > 0) this.invFoodProductionInputDetailFormData.Weight = UOM * qty;
    let amount = 0;
    if (rateUom > 0) {
      amount = (billWeight / rateUom) * rate;
      this.invFoodProductionInputDetailFormData.Amount = parseFloat(amount.toFixed(2));
    }
  };

  handleLoaderPopupVisibility(e) {
    this.showHideLoaderPopup = !this.showHideLoaderPopup;
  }

  selectedRecordFromLoader(e) {
    if (e?.length > 0 == false) {
      this.WarningPopup("Please Select Record To Load");
      return;
    } else {
      for (let i = 0; i < e.length; i++) {
        for (let j = 0; j < this.detailDataSource?.length; j++) {
          if (
            this.detailDataSource[j]?.RefDocNoId == e[i].RefDocIdNo &&
            this.detailDataSource[j]?.RefDocumentTypeId == e[i].RefDocumentTypeId &&
            this.detailDataSource[j]?.Amount == parseFloat(e[i].ItemAmount).toFixed(2) &&
            this.detailDataSource[j]?.Weight == e[i].WeightBalance
          ) {
            this.WarningPopup("You have already loaded this record");
            return;
          }
        }
      }
      this.showHideLoaderPopup = false;
      e.map((obj) => {
        this.detailDataSource.push({
          RefDocumentTypeId: obj.RefDocumentTypeId,
          RefDocNoId: obj.RefDocIdNo,
          RefDocSubIdNo: obj.RefDocSubIdNo,
          ItemId: obj.ItemId,
          ItemUomId: obj.ItemUom,
          CropBatch: obj.CropBatch,
          JobLotId: obj.JobLotId,
          PackingtypeId: obj.InvPackingTypeId,
          Qty: obj.QtyBalance,
          Weight: obj.WeightBalance,
          Rate: parseFloat(obj.AVgRate).toFixed(2),
          RateUOMId: obj.RateUomId,
          Amount: parseFloat(obj.ItemAmount).toFixed(2),
          WarehouseId: obj.WarehouseId,
          Remarks: "",
          ItemName: obj.ItemName,
          PackUnit: obj.PackSize,
          JobLotDescription: obj.JobLotCode,
          JobLotCode: obj.JobLotCode,
          PackTypeCode: obj.PackingType,
          PackTypeDesc: obj.PackingType,
          RateUOM: obj.Equivalent,
          WareHouseName: obj.WareHouseCode,
          IssueWeight: obj.WeightBalance,
          EntryType: "Issue",
        });
      });
    }
  }

  addDetailRecord2Grid() {
    if (validate(this.invFoodProductionInputDetailForm)) {
      this.invFoodProductionInputDetailFormData.ItemName = this.invFoodProductionInputDetailForm.instance.getEditor("ItemId").option("text");
      this.invFoodProductionInputDetailFormData.Equivalent = this.invFoodProductionInputDetailForm.instance.getEditor("ItemUomId").option("text");
      this.invFoodProductionInputDetailFormData.JobLotDescription = this.invFoodProductionInputDetailForm.instance.getEditor("JobLotId").option("text");
      this.invFoodProductionInputDetailFormData.PackTypeDesc = this.invFoodProductionInputDetailForm.instance.getEditor("PackingtypeId").option("text");
      this.invFoodProductionInputDetailFormData.RateUOM = parseFloat(this.invFoodProductionInputDetailForm.instance.getEditor("RateUOMId").option("text"));
      this.invFoodProductionInputDetailFormData.WareHouseName = this.invFoodProductionInputDetailForm.instance.getEditor("WarehouseId").option("text");
      this.invFoodProductionInputDetailFormData.JobLotCode = this.invFoodProductionInputDetailForm.instance.getEditor("JobLotId").option("text");
      this.invFoodProductionInputDetailFormData.PackTypeCode = this.invFoodProductionInputDetailForm.instance.getEditor("PackingtypeId").option("text");
      this.invFoodProductionInputDetailFormData.IssueWeight = this.invFoodProductionInputDetailFormData.Weight;
      this.invFoodProductionInputDetailFormData.EntryType = "Issue";

      if (this.detailEditMode) {
        this.detailDataSource[this.updateRowIndex] = this.invFoodProductionInputDetailFormData;
        this.detailEditMode = false;
        this.updateRowIndex = -1;
      } else {
        this.detailDataSource.push(this.invFoodProductionInputDetailFormData);
      }
      this.invFoodProductionInputDetailFormData = new invFoodProductionDetailModel();
      this.invFoodProductionInputDetailForm.instance.getEditor("ItemId").focus();
    }
  }

  editDetailRecordRow(editObject, index) {
    if (editObject.RefDocNoId > 0 == false) {
      this.detailEditMode = true;
      this.updateRowIndex = index;
      this.invFoodProductionInputDetailFormData = editObject;
    } else {
      this.WarningPopup("You cant edit loaded row");
    }
  }

  deleteDetailRecordRow(index) {
    this.detailDataSource.splice(index, 1);
  }

  goToHistory() {
    this.resetForm();
    this.closeClicked.emit("true");
  }

  onSAveButtonClicked() {
    if (this.invFoodProductionInputFormData.Id > 0) {
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
    if (validate(this.invFoodProductionInputForm)) {
      if (this.detailDataSource?.length > 0 == false) {
        this.WarningPopup("Detail Data Not Found!  Please Add Record in Detali to Proceed");
        return;
      }
      this.invFoodProductionInputFormData.EntryDate = new Date();
      this.invFoodProductionInputFormData.ModifyDate = new Date();
      this.invFoodProductionInputFormData.BranchId = this.branchesList[0].Id;
      this.invFoodProductionInputFormData.ProjectId = this.projectList[0].Id;
      this.invFoodProductionInputFormData.DocumentTypeId = 80;
      this.invFoodProductionInputFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.invFoodProductionInputFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.invFoodProductionInputFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.invFoodProductionInputFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.invFoodProductionInputFormData.InvJobOrderNo = this.invFoodProductionInputForm.instance.getEditor("InvJobOrderId").option("text");
      this.invFoodProductionInputFormData.invFoodProductionDetails = this.detailDataSource;
      this.invFoodProductionInputFormData.EntryType = "Input";
      this.invFoodProductionInputFormData.Id > 0 ? this.ActivateLoadPanel("Updating!") : this.ActivateLoadPanel("Saving!");
      this.service.Save(this.invFoodProductionInputFormData).subscribe(
        (resp) => {
          this.DeActivateLoadPanel();
          this.invFoodProductionInputFormData.Id > 0 ? this.SuccessPopup("Record Updated Successfully") : this.SuccessPopup("Record Saved Successfully");
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
