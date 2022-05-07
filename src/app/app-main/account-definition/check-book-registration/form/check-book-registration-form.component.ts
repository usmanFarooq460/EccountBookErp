import { Component, OnInit, Output, ViewChild, EventEmitter } from "@angular/core";
import { DxFormComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { validate } from "src/app/shared/Base/validationHelper";
import { checkBookRegistrationDetailModel, checkBookRegistrationModel } from "../check-book-registraion.model";
import { CheckBookRegistrationService } from "../check-book-registration.service";

@Component({
  selector: "check-book-registration-form",
  templateUrl: "./check-book-registration-form.component.html",
  styleUrls: [],
})
export class CheckBookRegistrationFormComponent extends BaseActions implements OnInit {
  @ViewChild("checkBookRegistrationForm", { static: false })
  checkBookRegistrationForm: DxFormComponent;
  checkBookRegistrationFormData: checkBookRegistrationModel;
  checkBookRegistrationDetailData: Array<checkBookRegistrationDetailModel>

  @Output() isSubmitted = new EventEmitter();

  BankAccountList: any;
  constructor(private service: CheckBookRegistrationService, private commonMethods: CommonMethodsForCombos) {
    super();
  }

  async ngOnInit() {
    this.initForm();
    await this.FetchData();
  }

  initForm() {
    this.checkBookRegistrationFormData = new checkBookRegistrationModel();
    this.checkBookRegistrationFormData.DocDate = new Date();
  }

  resetForm() {
    this.initForm();
  }
  async FetchData() {
    this.ActivateLoadPanel("Fetching Data For Form Fields");
    this.BankAccountList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.BankGetAll().catch((err) => this.HandleError(err)));
    this.DeActivateLoadPanel();
  }

  createDetailArray(netSerialNumber) {
    let detailArrayToSubmit = [];
    if (netSerialNumber >= 0 == false) {
      this.WarningPopup("Serail to cannot be greater than serail from ");
      return detailArrayToSubmit;
    } else {
      for (let i = 0; i <= netSerialNumber; i++) {
        detailArrayToSubmit.push({
          CheqBookHeaderId: undefined,
          Id: undefined,
          CheqNo: parseInt(this.checkBookRegistrationFormData.CbSrFrom) + i,
          CheqStatus: "Blank",
          OtherRemarks: this.checkBookRegistrationFormData.Remarks,
          CheqCancelStatus: false,
        });
      }
      return detailArrayToSubmit;
    }
  }
  handleSave() {
    if (validate(this.checkBookRegistrationForm)) {
      let netSerailNumber = parseInt(this.checkBookRegistrationFormData.CbSrTo) - parseInt(this.checkBookRegistrationFormData.CbSrFrom);
      if (netSerailNumber >= 0==false)  
      {
        this.WarningPopup("Serail from cannot be greater than serail to ");
        return;
      }


        this.checkBookRegistrationFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
        this.checkBookRegistrationFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
        this.checkBookRegistrationFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
        this.checkBookRegistrationFormData.PostUser = parseInt(sessionStorage.getItem("UserId"));
        this.checkBookRegistrationFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
        this.checkBookRegistrationFormData.PostState = false;
        this.checkBookRegistrationFormData.EntryDate = new Date();
        this.checkBookRegistrationFormData.ModifyDate = new Date();
        this.checkBookRegistrationFormData.PostDate = new Date();
        this.checkBookRegistrationFormData.Cheqbookdetaillist = this.createDetailArray(netSerailNumber);
        this.checkBookRegistrationFormData.ChartOfAccountId = this.checkBookRegistrationFormData.BankId;
        this.checkBookRegistrationFormData.ActionId = 1;
        this.ActivateLoadPanel("Saving!");
        this.service.Save(this.checkBookRegistrationFormData).subscribe(
          (resp) => {
            this.DeActivateLoadPanel();
            this.resetForm();
            this.SuccessPopup("Record Saved Successfully!")
            this.isSubmitted.emit("Submitted");
          },
          (error) => {
            this.DeActivateLoadPanel();
            this.HandleError(error);
          }
        );
     
    }
  }
}
