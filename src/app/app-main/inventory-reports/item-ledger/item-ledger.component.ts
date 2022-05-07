import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { ItemLedgerService } from "./item-ledger.service";
import { InventoryCommonService } from "../Inventorycommon.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { Router } from "@angular/router";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { ItemLedgerModel } from './ItemLedgerModel'

@Component({
  selector: "app-item-ledger",
  templateUrl: "./item-ledger.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class ItemLedgerComponent extends BaseActions implements OnInit {
  @ViewChild("itemLedgerGrid", { static: false })
  itemLedgerGrid: DxDataGridComponent;

  @ViewChild("itemLedgerForm", { static: false })
  itemLedgerForm: DxFormComponent;
  itemLedgerFormData: ItemLedgerModel;

  companyList = [];
  branchList = [];
  projectList = [];
  accountsList = [];
  dataSource = [];
  ItemList: any;

  constructor(private commonMethods: CommonMethodsForCombos,private router: Router, private service: ItemLedgerService, private commonService: CommonBaseService, private inventorycommon_service: InventoryCommonService) {
    super();
  }

  async ngOnInit() {
    this.breadCrumb("Inventory Report", "Item Ledger");
    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.ItemList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.ItemsGetAll());
    this.initForm();
  }
  public initForm() {
    this.itemLedgerFormData = new ItemLedgerModel();
    this.itemLedgerFormData.company = this.companyList[0].Id;
    this.itemLedgerFormData.project = this.projectList[0].Id;
    this.itemLedgerFormData.branch = this.branchList[0].Id;
    this.itemLedgerFormData.DateFrom = new Date(sessionStorage.getItem("StartPeriod"));
    this.itemLedgerFormData.DateTo = new Date();
  }

  // coaaccounts() {
  //   this.service
  //     .coaAccounts({
  //       CompanyId: sessionStorage.getItem("CompanyId"),
  //       OrganizationId: sessionStorage.getItem("OrganizationId"),
  //     })
  //     .subscribe(
  //       (result) => {
  //         this.accountsList = result;
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  // }
 

  onSubmit() {
    const result: any = this.itemLedgerForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      // this.notification("Critarea Apply: Thank You", "success");
      this.ActivateLoadPanel("Loading Data..")
      this.service
        .itemLedgerhistory({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          DateFrom: this.itemLedgerFormData.DateFrom,
          DateTo: this.itemLedgerFormData.DateTo,
          ItemId: this.itemLedgerFormData.Item,
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            this.dataSource = result;
          },
          (error) => {
            this.DeActivateLoadPanel();
            if (error.ExceptionMessage) {
              this.ErrorPopup(error.ExceptionMessage);
            } else if (error.Message) {
              this.ErrorPopup(error.Message);
            } else {
              this.ErrorPopup(error);
            }
          }
        );
    }
  }

  clear() {
    this.initForm();
  }

  goBack() {
    this.router.navigate(["/Reports"]);
  }

  onToolPreparingOfItemHistoryGrid = (e) => {
    e.toolbarOptions.items.unshift(
      {
        location: "after",
        widget: "dxButton",
        options: {
          id: "outstandingPaddyPurchaseOrderChartButton",
          icon: "back",
          hint: "Back",
          onClick: this.goBack.bind(this),
        },
      }
    );
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.onSubmit(),
      () => this.RefreshHistoryGridGrid(this.onSubmit.bind(this), this.HistoryGridSateKey("itemLedgerGrid"), this.itemLedgerGrid)
    );
  }
}


