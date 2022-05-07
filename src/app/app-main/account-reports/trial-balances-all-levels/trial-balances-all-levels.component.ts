import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { TrialBalancesAllLevelsService } from "./trial-balances-all-levels.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { trialBalanceAllLevelsModel } from "./trial-balance-all-levels.model";
import { Router } from "@angular/Router";

@Component({
  selector: "app-trial-balances-all-levels",
  templateUrl: "./trial-balances-all-levels.component.html",
  styleUrls: ["./trial-balances-all-levels.component.scss", "/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class TrialBalancesAllLevelsComponent extends BaseActions implements OnInit {
  @Input() IsLoadedInPopup: boolean = false;
  @ViewChild("trialBalanceAllLevelsGrid", { static: false })
  trialBalanceAllLevelsGrid: DxDataGridComponent;
  @ViewChild("expandOptionForm", { static: false })
  expandOptionForm: DxFormComponent;
  expandOptionFormData: trialBalanceAllLevelsModel;

  @ViewChild("trialBalanceAllLevelForm", { static: false })
  trialBalanceAllLevelForm: DxFormComponent;
  trialBalanceAllLevelFormData: trialBalanceAllLevelsModel;

  FromDate: Date;
  ToDate: Date;
  dataSource = [];
  enableExpandButton: boolean;
  expandOptionsReadOnly: boolean;
  expandOptions = [
    { Id: 1, option: "Upto 1st Level" },
    { Id: 2, option: "Upto 2nd Level" },
    { Id: 3, option: "Upto 3rd Level" },
    { Id: 4, option: "Upto All(4) Levels" },
  ];
  constructor(private router: Router, private service: TrialBalancesAllLevelsService, private commonService: CommonBaseService) {
    super();
    this.popoverVisible = false;
  }

  ngOnInit(): void {
    this.initForm();
    this.enableExpandButton = false;
    this.expandOptionsReadOnly = true;
    this.filtering()
    this.getTrialBalanceAllLevelData();

  }

  getTrialBalanceAllLevelData() {
    this.ActivateLoadPanel("Loading Data")
    this.service
      .trialBalanceAllLevelData({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FinancialYearId: sessionStorage.getItem("FinancialYearId"),
        FromDate: this.trialBalanceAllLevelFormData.fromDate,
        ToDate: this.trialBalanceAllLevelFormData.toDate,
      })
      .subscribe(
        (result) => {
          console.log(result);
          this.DeActivateLoadPanel();
          this.dataSource = result;
          this.expandOptionsReadOnly = false;
        },
        (error) => {
       this.DeActivateLoadPanel()
       this.HandleError(error);
        }
      );
  }
  toggle() {
    this.popoverVisible = !this.popoverVisible;
  }
  onSubmit() {
    this.getTrialBalanceAllLevelData();
  }
  clear() {
    this.trialBalanceAllLevelForm.instance.resetValues();
  }
  public initForm() {
    this.trialBalanceAllLevelFormData = new trialBalanceAllLevelsModel();
    this.trialBalanceAllLevelFormData.fromDate = sessionStorage.getItem("StartPeriod");
    this.trialBalanceAllLevelFormData.toDate = new Date();
    this.trialBalanceAllLevelFormData.ExpandOptions = this.expandOptions[0].Id;
  }

  changeGrouping = (e) => {
    
    if (e.value == 1) {
      this.trialBalanceAllLevelsGrid.instance.collapseAll(0);
      this.trialBalanceAllLevelsGrid.instance.collapseAll(1);
      this.trialBalanceAllLevelsGrid.instance.collapseAll(2);
    } else if (e.value == 2) {
      
      this.trialBalanceAllLevelsGrid.instance.expandAll(0);
      this.trialBalanceAllLevelsGrid.instance.collapseAll(1);
      this.trialBalanceAllLevelsGrid.instance.collapseAll(2);
    } else if (e.value == 3) {
      
      this.trialBalanceAllLevelsGrid.instance.expandAll(0);
      this.trialBalanceAllLevelsGrid.instance.expandAll(1);
      this.trialBalanceAllLevelsGrid.instance.collapseAll(2);
    } else if (e.value == 4) {
      
      this.trialBalanceAllLevelsGrid.instance.expandAll(0);
      this.trialBalanceAllLevelsGrid.instance.expandAll(1);
      this.trialBalanceAllLevelsGrid.instance.expandAll(2);
    }
  };
  toolbarPreparing=(e)=>
  {
    this.FilterButtonInGridToolbar(e);
  }
}
