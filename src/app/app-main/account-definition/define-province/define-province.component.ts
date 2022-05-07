import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { validate } from "src/app/shared/Base/validationHelper";
import { DefineProvinceModel } from "./define-province.model";
import { DefineProvinceService } from "./define-province.service";

@Component({
  selector: "app-define-province",
  templateUrl: "./define-province.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class DefineProvinceComponent extends BaseActions implements OnInit {
  @ViewChild("defineProvinceForm", { static: false })
  defineProvinceForm: DxFormComponent;
  defineProvinceFormData: DefineProvinceModel;
  @ViewChild("defineProvinceGrid", { static: false })
  defineProvinceGrid: DxDataGridComponent;

  IdForUpdate: number;
  countriesList = [];
  dataSource = [];

  showDefineProvincePopup: boolean;

  @Input() IsLoadedInPopup: boolean = false;
  @Input() SomeElementsVisible: boolean = true;

  constructor(private service: DefineProvinceService) {
    super();
  }

  ngOnInit(): void {
    this.breadCrumb("Inventory Definition","Define Province")
    this.initForm();
    this.getCountryId();
    this.getProvinceData();
  }

  initForm() {
    this.defineProvinceFormData = new DefineProvinceModel();
  }

  editPopup = (e) => {
   
    this.ActivateLoadPanel("Getting data for Update")
    this.service.getProvinceById(e.Id).subscribe(
      (result) => {
        this.DeActivateLoadPanel();
        
        this.IdForUpdate=e.Id
        this.defineProvinceFormData = result;
        this.showDefineProvincePopup = true;
      },
      (error) => {
        this.DeActivateLoadPanel();
        this.HandleError(error);
      }
    );
  };

  getProvinceData() {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .getProvincesData({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.dataSource = result;
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }

  //================================= Combo Bind
  getCountryId() {
    this.service
      .getCountries({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (resp) => {
          this.countriesList = resp;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  //================================= Combo Bind

  showHideFormPopup() {
    this.IdForUpdate=0;
    this.initForm();
    this.showDefineProvincePopup = !this.showDefineProvincePopup;
  }

  onSave() {
    if (validate(this.defineProvinceForm)) {
      this.defineProvinceFormData.EntryDate = new Date();
      this.defineProvinceFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.defineProvinceFormData.ModifyDate = new Date();
      this.defineProvinceFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.defineProvinceFormData.PostDate = new Date();
      this.defineProvinceFormData.PostUser = parseInt(sessionStorage.getItem("UserId"));
      this.defineProvinceFormData.PostState = false;
      this.defineProvinceFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.defineProvinceFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.defineProvinceFormData.Id>0?this.ActivateLoadPanel("Updating"): this.ActivateLoadPanel("Saving")
      this.service.saveProvinceData(this.defineProvinceFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.defineProvinceFormData.Id > 0 ? this.SuccessPopup("Updated Successfully") : this.SuccessPopup("Submitted Successfully");
          this.showDefineProvincePopup=false;
          this.getProvinceData();
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
    }
  }

  DummyMethod() {}
  onToolbarPreparing = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("defineProvinceGrid"), this.defineProvinceGrid));
    this.FilterButtonInGridToolbar(e);
  };
}
