import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { DxFormComponent } from "devextreme-angular";
import { DefineUserModel, UserAccountAllocationsList } from "../define-user.model";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { Router, ActivatedRoute } from "@angular/router";
import { validate } from "src/app/shared/Base/validationHelper";
import { DefineUserService } from "../define-user.service";
import ArrayStore from "devextreme/data/array_store";
@Component({
  selector: "app-define-user-form",
  templateUrl: "./define-user-form.component.html",
  styleUrls: ["./define-user-form.component.scss"],
})
export class DefineUserFormComponent extends BaseActions implements OnInit {
  @ViewChild("DefineUserForm", { static: false })
  DefineUserForm: DxFormComponent;
  DefineUserFormData: DefineUserModel;
  //#region  DataVariables
  RolesList = [];
  BranchesList = [];
  CompanyList: any;
  selectedComapanyIds: any;
  UserStatus: boolean = true;
  //#endregion
  //#region ConditionalVariables
  @Input() DefineUserParamsId: number;
  @Input() DefineUserFormPopupVisible: boolean;
  @Output() closePopup = new EventEmitter();
  //#endregion
  constructor(private commonMethods: CommonMethodsForCombos, private commonBaseService: CommonBaseService, private router: Router, private route: ActivatedRoute, private service: DefineUserService) {
    super();
  }
  async ngOnInit() {}
  async GetData() {
    this.ReadAllRole();
    this.BranchesList = await this.commonBaseService.getBranch();
    this.GetCompanies();
    this.initForm();
  }
  initForm() {
    this.DefineUserFormData = new DefineUserModel();
    this.DefineUserFormData.UserAccountAllocationsList = new Array<UserAccountAllocationsList>();
    this.selectedComapanyIds = [];
    this.UserStatus == true;
    this.DefineUserFormData.IsActive = true;
    if (this.DefineUserParamsId > 0) {
      this.GetById();
    }
  }

  GetById() {
    this.service.GetByID(this.DefineUserParamsId).subscribe(
      (result: any) => {
        console.log(result);
        this.DefineUserFormData = result;
      },
      (error) => {
        this.HandleError(error);
      }
    );
  }
  ReadAllRole() {
    this.service
      .ReadAllRole({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.RolesList = result;
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  async GetCompanies() {
    let list = await this.commonBaseService.getCompany();
    for (let i = 0; i < list.length; i++) {
      list[i].IsActive = true;
    }
    this.CompanyList = new ArrayStore({
      key: "Id",
      data: list,
    });
  }
  handleUserStatusChane = (e) => {
    console.log(e);
    this.DefineUserFormData.IsActive = e.value;
  };
  Reset() {
    this.router.navigate([], { queryParams: { Id: null } });
    this.DefineUserParamsId = 0;
    this.initForm();
  }
  close() {
    this.Reset();
    this.closePopup.emit("1");
  }
  Save() {
    if (validate(this.DefineUserForm)) {
      this.DefineUserFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.DefineUserFormData.EntryUserId = parseInt(sessionStorage.getItem("UserId"));
      this.DefineUserFormData.ModifyUserId = parseInt(sessionStorage.getItem("UserId"));
      this.DefineUserFormData.EntryDate = new Date();
      this.DefineUserFormData.ModifyDate = new Date();
      this.DefineUserFormData.BranchesId = this.BranchesList[0].Id;
      this.DefineUserFormData.AuthenticationEnabled = false;
      this.DefineUserFormData.UserGroupId = 0;
      if (this.DefineUserParamsId > 0 == false) {
        this.DefineUserFormData.ID = 0;
      }

      if (this.DefineUserParamsId > 0 == false) {
        if (this.DefineUserFormData.IsActive == false) {
          this.WarningPopup("To define User Status must be Active!");
          return;
        }
      }
      if (this.selectedComapanyIds == null || this.selectedComapanyIds == undefined) {
        this.WarningPopup("Please Select Atlease 1 Company for this User.");
      } else if (this.selectedComapanyIds.length > 0 == false) {
        this.WarningPopup("Please Select Atlease 1 Company for this User.");
        return;
      }
      this.DefineUserFormData.UserAccountAllocationsList = new Array<UserAccountAllocationsList>();
      for (let i = 0; i < this.selectedComapanyIds.length; i++) {
        this.DefineUserFormData.UserAccountAllocationsList.push({
          CompanyId: this.selectedComapanyIds[i],
          OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
          BranchId: this.BranchesList[0].Id,
          IsActive: true,
          EntryDate: new Date(),
          EntryUserId: parseInt(sessionStorage.getItem("UserId")),
          ModifyUserId: parseInt(sessionStorage.getItem("UserId")),
          ModifyDate: new Date(),
          Id: 0,
          UserAccountId: 0,
        });
      }
      console.log(this.DefineUserFormData);
      this.DefineUserParamsId > 0 ? this.ActivateLoadPanel("Updating User Info") : this.ActivateLoadPanel("Saving User Info");
      this.service.Save(this.DefineUserFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.DefineUserParamsId > 0 ? this.SuccessPopup("User Info Updated Successfully!") : this.SuccessPopup("User Info Saved Successfully!");
          this.Reset();
          console.log(result);
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
    }
  }
}
