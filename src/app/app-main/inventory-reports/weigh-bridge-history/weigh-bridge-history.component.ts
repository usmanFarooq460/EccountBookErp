import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { weighBridgeHistoryService } from "./weigh-bridge-history.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { weighBridgeHistoryModel } from "./weigh-bridge-history.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-weigh-bridge-history",
  templateUrl: "./weigh-bridge-history.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class weighBridgeHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("WeighBridgHistoryGrid", { static: false })
  WeighBridgHistoryGrid: DxDataGridComponent;

  @ViewChild("weighBridgeHistoryForm", { static: false })
  weighBridgeHistoryForm: DxFormComponent;
  weighBridgeHistoryFormData: weighBridgeHistoryModel;

  companyList = [];
  branchList = [];
  projectList = [];
  itemList = [];
  CustomerList:any;
  dataSource = [];

  constructor(
    private router: Router,
    private service: weighBridgeHistoryService,
    private commonService: CommonBaseService,
  ) {
    super();
  }

  async ngOnInit() {
    this.breadCrumb("Inventory Reports", "Weigh Bridge History");
    this.initForm();
    this.onLoad();
  }
  public initForm() {
    this.weighBridgeHistoryFormData = new weighBridgeHistoryModel();
    this.weighBridgeHistoryFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.weighBridgeHistoryFormData.ToDate = new Date();
  }
  
  onLoad() {
    this.popoverVisible = false;
    this.weighBridgeHistoryFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
    this.weighBridgeHistoryFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
    this.weighBridgeHistoryFormData.DocId = 83;
    this.ActivateLoadPanel("Loading Data..")
    this.service.weighBridgehistory(this.weighBridgeHistoryFormData).subscribe(
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
  onSubmit() {
    const result: any = this.weighBridgeHistoryForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.weighBridgeHistoryFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.weighBridgeHistoryFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.weighBridgeHistoryFormData.DocId = 83;
      this.ActivateLoadPanel("Loading Data..")
      this.service.weighBridgehistory(this.weighBridgeHistoryFormData).subscribe(
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
  ReportRegister281() {
    if (this.weighBridgeHistoryFormData) {
      this.service
        .InvRptWeighBridgeRegister_281({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.weighBridgeHistoryFormData.FromDate,
          ToDate: this.weighBridgeHistoryFormData.ToDate,
          FromDocNo: this.weighBridgeHistoryFormData.FromDocNo,
          ToDocNo: this.weighBridgeHistoryFormData.ToDocNo,
          GpSrNoF: this.weighBridgeHistoryFormData.GpSrNoF,
          GpSrNoT: this.weighBridgeHistoryFormData.GpSrNoT,

          ReportName: "281-InvRptWeighBridgeRegister",
        })
        .subscribe(
          (result) => window.open(result),
          (error) => {
            if (error.ExceptionMessage) {
              this.ErrorPopup(error.ExceptionMessage);
            } else if (error.Message) {
              this.ErrorPopup(error.Message);
            } else {
              this.ErrorPopup(error);
            }
          }
        );
    } else {
     this.ErrorPopup("Record Not Found");
    }
  }
  clear() {
    this.weighBridgeHistoryForm.instance.resetValues();
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
          icon: "print",
          hint: "Print 281-WB Register",
          onClick: this.ReportRegister281.bind(this),
        },
      },
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
      () => this.RefreshHistoryGridGrid(this.onLoad.bind(this), this.HistoryGridSateKey("WeighBridgHistoryGrid"), this.WeighBridgHistoryGrid)
    );
  }
}
