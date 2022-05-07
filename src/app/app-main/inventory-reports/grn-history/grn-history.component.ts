import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { GrnHistoryService } from "./grn-history.service";
import { InventoryCommonService } from "../Inventorycommon.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { GrnHistoryModel } from "./grn-history.model";
import DataSource from "devextreme/data/data_source";
import { Router } from "@angular/router";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos"; 

@Component({
  selector: "app-grn-history",
  templateUrl: "./grn-history.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class GrnHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("GRNHistoryGrid", { static: false })
  GRNHistoryGrid: DxDataGridComponent;

  @ViewChild("GrnHistoryForm", { static: false })
  GrnHistoryForm: DxFormComponent;
  GrnHistoryFormData: GrnHistoryModel;

  companyList = [];
  branchList = [];
  projectList = [];
  SupplierList:any ;
  dataSource = [];
  dataSourceLength = [];

  constructor(private commonMethods:CommonMethodsForCombos,private router:Router,private service: GrnHistoryService, private commonService: CommonBaseService, private inventorycommon_service: InventoryCommonService) {
    super();
  }

  setFocus = () => this.GrnHistoryForm.instance.getEditor("SupplierCustomerId").focus();
 

  async ngOnInit() {
    this.breadCrumb("Inventory Reports", "GRN -History");
    this.SupplierList=await this.commonMethods.GenerateDataSourceFromList(await  this.commonMethods.SupplierCustomerByOrganizationAndCompany())
    this.initForm();
  }
  public initForm() {
    this.GrnHistoryFormData = new GrnHistoryModel();
    this.GrnHistoryFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.GrnHistoryFormData.ToDate = new Date();
    this.onLoad();
  }
 
  onLoad() {
    this.ActivateLoadPanel("Loading Data..")
    this.dataSource = [];
    this.service.Grnhistory(this.GrnHistoryFormData).subscribe(
      (result) => {
        this.DeActivateLoadPanel();
        this.dataSource = result;
        this.dataSourceLength = [50, 100, result.length];
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

  onSubmit() {
    const result: any = this.GrnHistoryForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.ActivateLoadPanel("Loading Data..");
      this.dataSource = [];
      this.service.Grnhistory(this.GrnHistoryFormData).subscribe(
        (result) => {
          this.dataSource = result;
          this.DeActivateLoadPanel();
          this.dataSourceLength = [50, 100, result.length];
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
    this.GrnHistoryFormData = new GrnHistoryModel();
    this.GrnHistoryFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.GrnHistoryFormData.ToDate = new Date();
  }
  goBack() {
    this.router.navigate(["/admin-panel/report-panel"]);
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
      () => this.onLoad(),
      () => this.RefreshHistoryGridGrid(this.onLoad.bind(this), this.HistoryGridSateKey("GRNHistoryGrid"), this.GRNHistoryGrid)
    );
  }
  
}
