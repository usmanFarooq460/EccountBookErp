import { identifierModuleUrl } from "@angular/compiler";
import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { invFoodProductionSetttlementModel } from "./inv-food-production-settlement.model";
import { InvFoodProductionSettlementService } from "./inv-food-production-settlement.service";

@Component({
  selector: "inv-food-production-settlement",
  templateUrl: "./inv-food-production-settlement.component.html",
  styleUrls: ["./inv-food-production-settlement.component.scss"],
})
export class InvFoodProductionSettlementComponent extends BaseActions implements OnInit {
  @ViewChild("settlementForm", { static: false })
  settlementForm: DxFormComponent;
  settlementFormData: invFoodProductionSetttlementModel;

  @ViewChild("inputRawMaterialDataGrid", { static: false })
  inputRawMaterialDataGrid: DxDataGridComponent;

  @ViewChild("OutputProductionOutPut", { static: false })
  OutputProductionOutPut: DxDataGridComponent;

  @ViewChild("OverHeadProductionGrid", { static: false })
  OverHeadProductionGrid: DxDataGridComponent;

  @ViewChild("packingTypeProductionGrid", { static: false })
  packingTypeProductionGrid: DxDataGridComponent;

  jobOrderList = [];
  OutPutByProductData = [];
  InputDataSource = [];
  outputDataSource = [];
  overHeadsDataSource = [];
  packingTypeDataSource = [];
  OutputFinishGoodsList = [];

  inputCal = {
    description: "Input RawMaterial",
    itemQty: 0,
    netWeight: 0,
    Amount: 0,
  };
  OutPutByProductCal = {
    description: "Output By Product",
    itemQty: 0,
    netWeight: 0,
    Amount: 0,
  };
  OverHeads = {
    description: "OverHeads",
    Amount: 0,
  };
  packingMaterial = {
    description: "Packing Material",
    Amount: 0,
  };
  FinishGoods = {
    description: "Finish Goods",
    itemQty: 0,
    netWeight: 0,
    Amount: 0,
  };
  FGAverageRate = {
    description: "Fg Avg Rate",
    Rate: 0,
  };
  constructor(private service: InvFoodProductionSettlementService, private commonMethods: CommonMethodsForCombos) {
    super();
  }

  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("FoodProductionWithValues"));
    this.getAlljobOrderNumbers();
    this.initForm();
  }

  getAlljobOrderNumbers() {
    this.service
      .GetJobOrderNoForInvFoodProduction({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 403,
      })
      .subscribe(
        (resp) => {
          this.jobOrderList = resp;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  initForm() {
    this.settlementFormData = new invFoodProductionSetttlementModel();
  }

  ResetSettlement() {
    this.InputDataSource = [];
    this.outputDataSource = [];
    this.overHeadsDataSource = [];
    this.packingTypeDataSource = [];
    this.OutputFinishGoodsList = [];

    this.inputCal.Amount = 0;
    this.inputCal.itemQty = 0;
    this.inputCal.netWeight = 0;

    this.OutPutByProductCal.Amount = 0;
    this.OutPutByProductCal.itemQty = 0;
    this.OutPutByProductCal.netWeight = 0;

    this.FinishGoods.Amount = 0;
    this.FinishGoods.itemQty = 0;
    this.FinishGoods.netWeight = 0;

    this.OverHeads.Amount = 0;
    this.packingMaterial.Amount = 0;
    this.FGAverageRate.Rate = 0;
    this.initForm();
  }

  generateAllReports() {
    this.getDataForAllReportsWithActivityValues(this.settlementFormData.InvProductionJobOrderId);
  }

  async getDataForAllReportsWithActivityValues(data) {
    let inputOutputData = await this.getAllInvFoodProductionSettlement("InPutOutPut", data);
    this.InputDataSource = inputOutputData.filter(({ EntryType }) => EntryType == "Input");
    this.outputDataSource = inputOutputData.filter(({ EntryType }) => EntryType == "Output");
    this.overHeadsDataSource = await this.getAllInvFoodProductionSettlement("OverHeads", data);
    this.packingTypeDataSource = await this.getAllInvFoodProductionSettlement("PackingMaterial", data);
    this.getFinishGoodsTotalWeight(this.outputDataSource);
    console.log("Output Data Source: ", this.outputDataSource);
  }

  async getAllInvFoodProductionSettlement(Activity: string, jobOrderId) {
    return await this.service
      .getAllInvFoodProductionSettlement({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        JobOrderId: jobOrderId,
        Activity: Activity,
      })
      .catch((error) => {
        this.HandleError(error);
      });
  }

  getFinishGoodsTotalWeight(outputData) {
    let finishGoodsArray = [];
    let totalWeight = 0;
    if (outputData?.length > 0) {
      for (let item of outputData) {
        if (item.EntryTypeDetail == "FinishGoods") {
          finishGoodsArray.push(item);
        }
      }
      if (finishGoodsArray?.length > 0) {
        for (let item of finishGoodsArray) {
          totalWeight = totalWeight + item.Weight;
        }
      }
      this.GetAllSettlementSCalculatedData(totalWeight);
    } else {
      this.WarningPopup("Output data Not found");
    }
  }

  GetAllSettlementSCalculatedData(FinishGoodsTotalWeight) {
    this.service
      .GetSummeryValues({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        JobOrderId: this.settlementFormData.InvProductionJobOrderId,
        NetWeight: FinishGoodsTotalWeight,
      })
      .subscribe(
        (resp) => {
          this.divideDataForAllTypes(resp); //calculated Net Weight ammount and net Qty For Inout Outout Overheads and Packing Type
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  divideDataForAllTypes(data) {
    if (data?.length > 0) {
      for (let item of data) {
        if (item.TranType == "Input Raw Material") {
          this.inputCal = {
            description: "Input RawMaterial",
            itemQty: item.NetQty,
            netWeight: item.NetWeight,
            Amount: item.Amount,
          };
        }
        if (item.TranType == "Packing Material") {
          this.packingMaterial = {
            description: "Packing Material",
            Amount: item.Amount,
          };
        }
        if (item.TranType == "Over Heads") {
          this.OverHeads = {
            description: "Over Heads",
            Amount: item.Amount,
          };
        }
        if (item.TranType == "OutPut By Product") {
          this.OutPutByProductCal = {
            description: "Output By Product",
            itemQty: item.NetQty,
            netWeight: item.NetWeight,
            Amount: item.Amount,
          };
        }
        if (item.TranType == "Output Finish Goods") {
          this.FinishGoods = {
            description: "Finish Goods",
            itemQty: item.NetQty,
            netWeight: item.NetWeight,
            Amount: item.Amount.toFixed(3),
          };
          this.FGAverageRate.Rate = parseFloat((this.FinishGoods.Amount / this.FinishGoods.netWeight).toFixed(3));
        }
      }
    }
  }

  ApplyRateToFinishGoods() {
    let flag = false;
    if (this.FGAverageRate.Rate > 0 && this.outputDataSource?.length > 0) {
      for (let i = 0; i < this.outputDataSource.length; i++) {
        if (this.outputDataSource[i].EntryTypeDetail == "FinishGoods") {
          this.outputDataSource[i].Rate = this.FGAverageRate.Rate * this.outputDataSource[i].RateUom;
          this.outputDataSource[i].Amount = this.outputDataSource[i].Rate * (this.outputDataSource[i].Weight / this.outputDataSource[i].RateUom);
          this.OutputFinishGoodsList.push(this.outputDataSource[i]);
          flag = true;
        }
      }
      if (flag == true) this.SuccessPopup("Rate has Applied Successfully");
    } else if (this.outputDataSource?.length > 0 == false || flag == false) {
      this.WarningPopup("Please Generate data Against Job Order To Proceed or Finish Goods Not Found");
    }
  }

  UpdateSettlementToSaveRateInFinishGoods() {
    if (this.UserRightsObject.canUpdate == false) {
      this.ErrorPopup("You dont have Right to Update!");
      return;
    }
    if (this.OutputFinishGoodsList?.length > 0 == false) {
      this.WarningPopup("Please Apply Rate To Update Settelments");
      return;
    }
    let OutPutFiniShGoodsToUpdate = [];
    for (let item of this.OutputFinishGoodsList) {
      OutPutFiniShGoodsToUpdate.push({
        Id: item.DetailId,
        InvFoodProductionId: item.Id,
        EntryType: item.EntryTypeDetail,
        RefDocNoId: 0,
        WarehouseId: item.WarehouseId,
        ItemId: item.ItemId,
        ItemUomId: item.ItemUomId,
        CropBatch: item.CropBatch,
        JobLotId: item.JobLotId,
        PackingtypeId: item.PackingtypeId,
        Qty: item.Qty,
        Weight: item.Weight,
        Rate: item.Rate,
        RateUOMId: item.RateUOMId,
        InvProductionJobOrderId: this.settlementFormData.InvProductionJobOrderId,
        Amount: item.Amount,
        VoucherHeadId: item.WIPAccountId,
        Remarks: item.Remarks,
      });
    }
    this.settlementFormData.invFoodProductionDetails = OutPutFiniShGoodsToUpdate;
    this.ActivateLoadPanel("Updating!");
    this.settlementFormData.InvProductionJobOrderId = null;
    this.service.UpdateSettlement(this.settlementFormData).subscribe(
      (resp) => {
        this.DeActivateLoadPanel();
        this.SuccessPopup("Record has Updated Successfully");
      },
      (error) => {
        this.DeActivateLoadPanel();
        this.HandleError(error);
      }
    );
  }

  DummyMethod() {}
  onToolbarPreparingOfInput = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("inputRawMaterialDataGrid"), this.inputRawMaterialDataGrid));
    this.FilterButtonInGridToolbar(e);
  };
  onToolbarPreparingOfOutput = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("OutputProductionOutPut"), this.OutputProductionOutPut));
    this.FilterButtonInGridToolbar(e);
  };
  onToolbarPreparingOfOverHead = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("OverHeadProductionGrid"), this.OverHeadProductionGrid));
    this.FilterButtonInGridToolbar(e);
  };
  onToolbarPreparingOfPackingType = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("packingTypeProductionGrid"), this.packingTypeProductionGrid));
    this.FilterButtonInGridToolbar(e);
  };
}
