import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxFormComponent } from "devextreme-angular";
import { DefineItemService } from "../define-item.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { DefineItem } from "../define-item.model";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { validate } from "src/app/shared/Base/validationHelper";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import DataSource from "devextreme/data/data_source";
// import { WsrmTransferNotesHistoryDetailComponent } from "src/app/app-main/whole-sale-retail-management/wsrm-transfer-notes";
import ArrayStore from "devextreme/data/array_store";
@Component({
  selector: "Invetory-Item-form",
  templateUrl: "./define-item-form.component.html",
  styleUrls: [],
})
export class DefineItemFormComponent extends BaseActions implements OnInit {
  @Input() itemId: number;
  @Output() closeItemFormPopup = new EventEmitter();
  @ViewChild("ItemForm", { static: false })
  ItemForm: DxFormComponent;
  ItemFormData: DefineItem;
  //
  catagoryList = [];
  baseUnitList = [];
  itemTypeList = [];
  itemClassList = [];
  itemGroupList = [];
  purchaseAcList: any;
  saleAcList: any;
  cgsAcList: any;
  dataSource = [];
  itemParamsId: number;
  ItemCodeGenerate: string;
  Id4Submit: number;
  catagoryId: number;
  catagoryCode: any;
  //==================================
  selectedComapanyIds=[];
  brancheList=[]
  dataSourcCompnay:any
  constructor(private service: DefineItemService, private commonMethods: CommonMethodsForCombos, private commonService: CommonBaseService, private route: ActivatedRoute, private router: Router) {
    super();
  }
  async ngOnInit() {
    this.itemParamsId = this.itemId;
    //  await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetAccountsIncludingAccountTypeIds(""))
    this.breadCrumb("Inventory Definition", "Item");
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("frmDefineItem"))
    this.catagoryList=await this.commonMethods.ItemCategoriesGetAll();
    this.itemTypeList=await this.commonMethods.ItemTypesGetAll();
    this.itemClassList=await this.commonMethods.ItemClassGetAll();
    this.brancheList=await this.commonService.getBranch();
    let data = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.CoaAllocationGetAll());
    this.purchaseAcList=data;
    this.saleAcList=data;
    this.cgsAcList=data;
    this.ItemGroupGetAll();
    this.BaseUnitGetAll();
    this.getCompany()
    this.initForm();
  }
  ngOnDestroy(): void {
    this.catagoryList = [];
    this.baseUnitList = [];
    this.itemTypeList = [];
    this.itemClassList = [];
    this.itemGroupList = [];
    this.purchaseAcList = [];
    this.saleAcList = [];
    this.cgsAcList = [];
    this.dataSource = [];
    this.itemParamsId = null;
    this.ItemCodeGenerate = null;
    this.Id4Submit = null;
    this.catagoryId = null;
    this.catagoryCode = null;
    this.itemId = null;
  }
  public initForm() {
    this.ItemFormData = new DefineItem();
    if (this.itemParamsId) {
      this.GetbyId();
    }
  }
  GetbyId() {
    this.Id4Submit = this.itemParamsId;
    this.service.ItemReadById(this.Id4Submit).subscribe(
      (result) => {
        this.ItemFormData = result;
      },
      (error) => this.HandleError(error)
    );
  }
  BaseUnitGetAll() {
    this.service
      .ItemBaseUnit({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.baseUnitList = result;
        },
        (error) => this.HandleError(error)
      );
  }
  ItemGroupGetAll() {
    this.service
      .ItemGroup({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.itemGroupList = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  getCompany() {
    this.service
      .getCompany({
        OrgCompanyTypeId: this.commonService.OrganizationId(),
      })
      .subscribe(
        (result) => {
          this.dataSourcCompnay = new ArrayStore({
            key: "Id",
            data: result,
          });
          for (let i = 0; i < result.length; i++) {
            this.selectedComapanyIds.push(result[i].Id);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  GenerateCodeItem(Id) {
    if (this.catagoryId !== Id) {
      this.service
        .GenerateCodeByCatagoryId({
          ItemCategoryId: Id,
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
        })
        .subscribe(
          (result) => {
            result.map((item) => {
              // this.ItemCodeGenerate = item.ItemCode;
              this.ItemFormData.ItemCode = item.ItemCode;
            });
          },
          (error) => this.HandleError(error)
        );
    } else {
      this.ItemFormData.ItemCode = this.catagoryCode;
    }
  }
  GetGLAccountbyItemCategoryId(Id) {
    if (this.Id4Submit == null) {
      let CatagaoryId = Id;
      this.service
        .GetGLAccountbyItemCategoryId({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          ItemCategoryId: CatagaoryId,
        })
        .subscribe(
          (result) => {
            result.map((item) => {
              (this.ItemFormData.PurchaseGLAC = item.InventoryAccountId), (this.ItemFormData.SaleGLAC = item.RevenueAccountId), (this.ItemFormData.COGSGLAC = item.CGSAccountId);
            });
          },
          (error) => this.HandleError(error)
        );
    }
  }
  GenerateCode = (e) => {
    if (e.value) {
      this.GenerateCodeItem(e.value);
      this.GetGLAccountbyItemCategoryId(e.value);
    } else {
      this.ItemFormData.ItemCode = " ";
    }
  };
  /////////////////////////////////////////////////////////////////
  close() {
    this.closeItemFormPopup.emit("1");
    this.itemId = null;
  }
  onSave() {
    if(this.itemParamsId>0==false && this.UserRightsObject.canSave==false)
    {
      this.WarningPopup("You don't have right to Save")
      return ;
    }
    else if(this.itemParamsId>0 && this.UserRightsObject.canUpdate==false)
    {
      this.WarningPopup("You don't have right to Update!")
      return ;
    }
    this.submit()
  }
  /////////////////////edit////////////////////////////////////////
  submit() {
    if (validate(this.ItemForm)) {
      let id;
      this.Id4Submit ? (id = this.Id4Submit) : (id = null);
      this.ItemFormData.PackQty = 1;
      this.ItemFormData.Id = id;
      this.ItemFormData.ItemAllocationlist = [];
      if (this.selectedComapanyIds.length > 0) {
        for (let i = 0; i < this.selectedComapanyIds.length; i++) {
          this.ItemFormData.ItemAllocationlist.push({
            IsActive: true,
            OrganizationId: this.commonService.OrganizationId(),
            CompanyId: this.selectedComapanyIds[i],
            BranchId: this.brancheList[0].Id,
            ItemId: 0,
          });
        }
      } else {
        this.WarningPopup("Please Select At Least 1 Company To Allocate Item")
        return;
      }
      this.ItemFormData.ItemStatus = false;
      this.ItemFormData.EntryDate = new Date();
      this.ItemFormData.ModifyDate = new Date();
      this.ItemFormData.PostDate = new Date();
      this.ItemFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.ItemFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.ItemFormData.PostUser = parseInt(sessionStorage.getItem("UserId"));
      this.ItemFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.ItemFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.ItemFormData.PostState = false;
      this.service.ItemSave(this.ItemFormData).subscribe(
        (result) => {
          if (id == null) {
            this.SuccessPopup("Record Saved successfully");
          } else {
            this.SuccessPopup("Record Updated Successfully");
          }
          this.router.navigate([], { queryParams: { Id: null } });
          this.clear();
          this.itemId = null;
          this.close();
        },
        (error) => this.HandleError(error)
      );
    }
  }
  clear() {
    this.catagoryCode = null;
    this.catagoryId = null;
    this.Id4Submit = null;
    this.itemParamsId = null;
    this.initForm();
  }
}
