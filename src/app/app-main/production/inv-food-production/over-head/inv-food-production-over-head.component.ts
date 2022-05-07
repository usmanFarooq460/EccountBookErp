import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { validate } from "src/app/shared/Base/validationHelper";
import { invFoodProductionOverHeadModel } from "./inv-food-production-over-head.model";
import { InvFoodProductionOverHeadService } from "./inv-food-production-over-head.service";

// Financial year Id Error on save and update==============================================================

@Component({
  selector: "inv-food-production-over-head",
  templateUrl: "./inv-food-production-over-head.component.html",
  styleUrls: [],
})
export class InvFoodProductionOverHeadComponent extends BaseActions implements OnInit {
  @ViewChild("overHeadForm", { static: false })
  overHeadForm: DxFormComponent;
  overHeadFormData: invFoodProductionOverHeadModel;
  @ViewChild("OverHeadProductionGrid", { static: false })
  OverHeadProductionGrid: DxDataGridComponent;

  jobOrderList = [];
  dataSource = [];
  accountList: any;
  constructor(private service: InvFoodProductionOverHeadService, private commonMethods: CommonMethodsForCombos) {
    super();
  }

  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("FoodProductionWithValues"));
    await this.FetchData();
    this.getHistoryOfPackingType();
    this.initForm();
  }

  async FetchData() {
    let account = await this.commonMethods.CoaAllocationGetAll().catch((err) => console.log("error: ", err));
    this.accountList = await this.commonMethods.GenerateDataSourceFromList(account.filter(({ AccountTypeId }) => AccountTypeId !== 15 && AccountTypeId !== 11 && AccountTypeId !== 2));
    this.jobOrderList = await this.getAllProductionJobOrder();
  }

  async initForm() {
    this.overHeadFormData = new invFoodProductionOverHeadModel();
    this.overHeadFormData.DocDate = new Date();
    if (this.overHeadFormData.Id > 0 == false) {
      this.overHeadFormData.DocNo = await this.GetSerialNumberForInvFoodProdcution();
    }
    this.overHeadForm.instance.getEditor("InvProductionJobOrderId").focus();
  }

  editForm = (e) => {
    if (this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You dont have Right to Update");
      return;
    }
    this.ActivateLoadPanel("Getting data For Update");
    this.service.GetByID(e.Id).subscribe(
      (resp: invFoodProductionOverHeadModel) => {
        this.DeActivateLoadPanel();
        this.overHeadFormData = resp;
      },
      (err) => {
        this.DeActivateLoadPanel();
        this.HandleError(err);
      }
    );
  };

  async GetSerialNumberForInvFoodProdcution() {
    return await this.service
      .GenerateCode({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
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

  calculationsInDetailForm = (e) => {
    let qty = this.overHeadFormData.ItemQty > 0 ? this.overHeadFormData.ItemQty : 0;
    let rate = this.overHeadFormData.ItemRate > 0 ? this.overHeadFormData.ItemRate : 0;
    if (qty > 0 && rate > 0) {
      this.overHeadFormData.Amount = qty * rate;
    }
  };

  resetForm() {
    this.initForm();
  }

  getHistoryOfPackingType() {
    this.ActivateLoadPanel("Fetching Data");
    this.service
      .FormHistoryOfPackingType({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (resp) => {
          this.dataSource = resp;
          this.DeActivateLoadPanel();
        },
        (err) => {
          this.DeActivateLoadPanel();
          this.HandleError(err);
        }
      );
  }

  onSAveButtonClicked() {
    this.UserRightsObject.canSave ? this.onSave() : this.ErrorPopup("You dont have Right to Save");
  }

  onSave() {
    if (validate(this.overHeadForm)) {
      this.overHeadFormData.DocumentTypeId = 112; // dummy document type id ////////////////////////////// 15 2
      this.overHeadFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.overHeadFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.overHeadFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.overHeadFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.overHeadFormData.EntryDate = new Date();
      this.overHeadFormData.ModifyDate = new Date();
      this.overHeadFormData.Id > 0 ? this.ActivateLoadPanel("Updating") : this.ActivateLoadPanel("Saving!");
      this.service.Save(this.overHeadFormData).subscribe(
        (resp) => {
          this.DeActivateLoadPanel();
        },
        (err) => {
          this.DeActivateLoadPanel();
          this.HandleError(err);
        }
      );
    }
  }

  DummyMethod() {}
  onToolbarPreparing = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("OverHeadProductionGrid"), this.OverHeadProductionGrid));
    this.FilterButtonInGridToolbar(e);
  };
}
