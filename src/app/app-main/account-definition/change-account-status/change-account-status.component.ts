import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxFormComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { validate } from "src/app/shared/Base/validationHelper";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { changeAccountStatusModel } from "./change-account-status.model";
import { ChangeAccountStatusService } from "./change-account-status.service";
@Component({
  selector: "app-change-account-status",
  templateUrl: "./change-account-status.component.html",
  styleUrls: [],
})
export class ChangeAccountStatusComponent extends BaseActions implements OnInit {
  @ViewChild("changeAccountStatusForm", { static: false })
  changeAccountStatusForm: DxFormComponent;
  changeAccountStatusFormData: changeAccountStatusModel;
  AccountsList: any;
  showChangeAccountStatusFormPopup: boolean;
  @Input() IsLoadedInPopup: boolean = false;
  @Input() SomeElementsVisible: boolean = true;
  constructor(private service: ChangeAccountStatusService, private commonMethods: CommonMethodsForCombos) {
    super();
  }
  async ngOnInit() {
    this.breadCrumb("Account Definitions", "Change Account Satus");
    this.AccountsList = await this.commonMethods.GenerateDataSourceFromList(await this.getAccountListForComboBind().catch((err) => this.HandleError(err)));
    await this.getAccountListForComboBind();
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("frmChangeAccountStatus"));
    this.initForm();
  }
  initForm() {
    this.changeAccountStatusFormData = new changeAccountStatusModel();
  }
  async getAccountListForComboBind() {
    return await this.service.getAccountsForComboBind({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
    });
  }

  onAccountTitleChange = (e) => {
    this.service
      .getStatusOnAccountValueChange({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        Id: e.value,
      })
      .subscribe(
        (resp) => {
          if (resp?.length > 0) {
            this.changeAccountStatusFormData.ISACTIVE = resp[0].IsActive;
          }
        },
        (error) => {
          this.HandleError(error);
        }
      );
  };
  onUpdateClick() {
    if (this.UserRightsObject.canUpdate) {
      this.updateAccountTitle();
    } else {
      this.WarningPopup("You dont have right to update");
    }
  }
  updateAccountTitle() {
    if (validate(this.changeAccountStatusForm)) {
      this.changeAccountStatusFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.changeAccountStatusFormData.GLPAGENO = "";
      this.ActivateLoadPanel("Updating!");
      this.service.updateCOAllocaionAcccount(this.changeAccountStatusFormData).subscribe(
        (resp) => {
          this.DeActivateLoadPanel();
          this.SuccessPopup("Record  Upadated Successfully!");
        },
        (err) => {
          this.DeActivateLoadPanel();
          this.HandleError(err);
        }
      );
    }
  }
}
