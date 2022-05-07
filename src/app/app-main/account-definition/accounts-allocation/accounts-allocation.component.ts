import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { CoaAllocationService } from "./accounts-allocation.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CoaAllocationModel, CoaallocationList } from "./accounts-allocation.model";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import notify from "devextreme/ui/notify";
@Component({
  selector: "app-accounts-allocation",
  templateUrl: "./accounts-allocation.component.html",
  styleUrls: [],
})
export class AccountsAllocationComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("coaallocationForm", { static: false })
  coaallocationForm: DxFormComponent;
  coaallocationFormData: CoaAllocationModel;
  companyList = [];
  accountList = [];
  selectedrecord = [];
  dataSource = [];
  chartOfAccountIdArr = [];
  canView: boolean;
  canSave: boolean;
  canPrint: boolean;
  canUpdate: boolean;
  checkBoxVal: boolean;
  constructor(private service: CoaAllocationService, private commonService: CommonBaseService) {
    super();
    this.popoverVisible = false;
    this.filter = false;
  }
  toggle() {
    this.popoverVisible = !this.popoverVisible;
  }
  filtering() {
    this.filter = !this.filter;
  }
  async ngOnInit() {
    this.breadCrumb("Account Definition", "Account Allocation");
    this.userRights();
    this.FuncGetAllPendingaccount();
    this.initForm();
    this.companyList = await this.commonService.getCompany();
  }
  public initForm() {
    this.coaallocationFormData = new CoaAllocationModel();
    this.coaallocationFormData.COAAllocationlist = [];
  }
  FuncGetAllPendingaccount() {
    this.service
      .COAAllocationGetAll({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => {
          this.dataSource = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  userRights() {
    this.commonService
      .userRights({
        UserId: this.commonService.UserId(),
        ScreenName: "AcfrmAcAllocation",
        RightName: this.commonService.RoleName(),
      })
      .subscribe(
        (result) => {
          for (let { RightName, Value } of result) {
            if (RightName === "Save") {
              this.canSave = Value;
            }
          }
        },
        (error) => console.log(error)
      );
  }
  onSave() {
    if (this.canSave) {
      // this.onSave();
    } else {
      notify("You don't have right to Save", "error");
      return;
    }
  }
  onSubmit() {
    const result: any = this.coaallocationForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.coaallocationFormData.COAAllocationlist = [];
      this.selectedrecord = this.dataGrid.instance.getSelectedRowsData();
      if (this.selectedrecord.length > 0) {
        for (let item of this.selectedrecord) {
          this.coaallocationFormData.COAAllocationlist.push({
            IsActive: true,
            ChartofAccountId: item.Id,
            CompanyId: this.coaallocationFormData.CompanyId,
            GLPageNo: "",
          });
        }
        this.service
          .COAAllocationSave({
            COAAllocationlist: this.coaallocationFormData.COAAllocationlist,
          })
          .subscribe(
            (result) => {
              this.notification("Record Saved successfully", "success");
              this.clear();
            },
            (error) => console.log(error)
          );
      } else {
        this.notification("Please Checked Record For Saved ", "error");
      }
    }
  }
  clear() {
    this.coaallocationForm.instance.resetValues();
    this.dataGrid.instance.refresh();
    this.FuncGetAllPendingaccount();
    this.selectedrecord = null;
  }
  onToolbarPreparing(event) {
    this.toolbarPreparing(
      event,
      () => this.dataGrid.instance.refresh(),
      () => this.exportGrid(this.dataGrid.instance)
    );
  }
}
