import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { GatePassInwardHistoryService } from "./gatepass-inward-history.service";
import { InventoryCommonService } from "../Inventorycommon.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { GatePassInwardModel } from "./gatepass-inward-history.model";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos"
import notify from "devextreme/ui/notify";
import DataSource from "devextreme/data/data_source";
import { Router } from "@angular/router";
@Component({
  selector: "app-gatepass-inward-history",
  templateUrl: "./gatepass-inward-history.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class gatePassInwardHistoryComponent extends BaseActions implements OnInit {
  
  @ViewChild("gatepassInwardHistroyGrid", { static: false })
  gatepassInwardHistroyGrid: DxDataGridComponent;
  @ViewChild("gatepassInwardHistoryForm", { static: false })
  gatepassInwardHistoryForm: DxFormComponent;
  gatepassInwardHistoryFormData: GatePassInwardModel;
  SupplierList:any = [];
  dataSource = [];
  statusList = [{ name: "Open" }, { name: "Accepted" }, { name: "Rejected" }];

  constructor(private router:Router,private commonMethods:CommonMethodsForCombos, private service: GatePassInwardHistoryService, private commonService: CommonBaseService, private inventorycommon_service: InventoryCommonService) {
    super();
  }

  setFocus = () => this.gatepassInwardHistoryForm.instance.getEditor("FromDate").focus();
 
  async ngOnInit() {
    this.breadCrumb("Inventory Reports", "GatePass Inward History");
    this.SupplierList=await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.SupplierCustomerByOrganizationAndCompany());
    this.initForm();
    this.onLoad();
  }
  public initForm() {
    this.gatepassInwardHistoryFormData = new GatePassInwardModel();
    this.gatepassInwardHistoryFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.gatepassInwardHistoryFormData.ToDate = new Date();
  }
  
  onLoad() {
    this.ActivateLoadPanel("Loading Data..")
    this.service.GatePassInwardhistory(this.gatepassInwardHistoryFormData).subscribe(
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
    const result: any = this.gatepassInwardHistoryForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.ActivateLoadPanel("Loading Data..")
      this.service.GatePassInwardhistory(this.gatepassInwardHistoryFormData).subscribe(
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

  ReportRegister253() {
    if (this.gatepassInwardHistoryFormData) {
      this.service
        .InvRptGatePassInwardRegisterA_253({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.gatepassInwardHistoryFormData.FromDate,
          ToDate: this.gatepassInwardHistoryFormData.ToDate,
          FromDocNo: this.gatepassInwardHistoryFormData.FromDocNo,
          ToDocNo: this.gatepassInwardHistoryFormData.ToDocNo,
          SupplierCustomerId: this.gatepassInwardHistoryFormData.SupplierCustomerId,
          Status: this.gatepassInwardHistoryFormData.Status,

          ReportName: "253-InvRptGatePassInwardRegisterA",
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
  onPrint(e) {
    this.service
      .getpdfReport({
        DocumentTypeId: 51,
        Id: e.Id,
        //Compulosry
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "251-InvRptInwardGatePassSlip",
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
  }
  clear() {
   this.initForm();
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
          hint: "Print 253-IGP Register",
          onClick: this.ReportRegister253.bind(this),
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
      () => this.RefreshHistoryGridGrid(this.onLoad.bind(this), this.HistoryGridSateKey("gatepassInwardHistroyGrid"), this.gatepassInwardHistroyGrid)
    );
  };
 
}
