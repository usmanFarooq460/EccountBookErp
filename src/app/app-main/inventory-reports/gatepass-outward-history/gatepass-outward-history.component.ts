import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { GatePassInwardHistoryService } from "./gatepass-outward-history.service";
import { InventoryCommonService } from "../Inventorycommon.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { GatePassoutwardModel } from "./gatepass-outward-history.model";
import notify from "devextreme/ui/notify";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { Router } from "@angular/router";
@Component({
  selector: "app-gatepass-outward-history",
  templateUrl: "./gatepass-outward-history.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class gatePassOutwardHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("gatePassOutwardGrid", { static: false })
  gatePassOutwardGrid: DxDataGridComponent;
  @ViewChild("gatepassOutwardHistoryForm", { static: false })
  gatepassOutwardHistoryForm: DxFormComponent;
  gatepassOutwardHistoryFormData: GatePassoutwardModel;
  SupplierList :any;
  dataSource = [];
  statusList = [{ name: "Open" }, { name: "Accepted" }, { name: "Rejected" }];
  constructor(
    private commonMethods: CommonMethodsForCombos,
    private service: GatePassInwardHistoryService,
    private commonService: CommonBaseService,
    private router:Router
  ) {
    super();
  }
  setFocus = () => this.gatepassOutwardHistoryForm.instance.getEditor("FromDate").focus();
  
  async ngOnInit() {
    this.breadCrumb("Inventory Reports", "GatePass Outward History");
    // this.Supplier();
    this.SupplierList=await this.commonMethods.GenerateDataSourceFromList(await  this.commonMethods.SupplierCustomerByOrganizationAndCompany())
    this.initForm();
    this.onLoad();
  }
  public initForm() {
    this.gatepassOutwardHistoryFormData = new GatePassoutwardModel();
    this.gatepassOutwardHistoryFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.gatepassOutwardHistoryFormData.ToDate = new Date();
  }
  
  onLoad() {
    this.ActivateLoadPanel("Loading Data..")
    this.service.GatePassInwardhistory(this.gatepassOutwardHistoryFormData).subscribe(
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
    const result: any = this.gatepassOutwardHistoryForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.ActivateLoadPanel("Loading Data..")
      this.service.GatePassInwardhistory(this.gatepassOutwardHistoryFormData).subscribe(
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
  ReportRegister291() {
    if (this.gatepassOutwardHistoryFormData) {
      this.service
        .InvRptGatePassOutwardRegister_291({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          ReportName: "291-InvRptGatePassOutwardRegister",
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
      this.ErrorPopup("Record Not Found")
    }
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
          hint: "291-OGP Register",
          onClick: this.ReportRegister291.bind(this),
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
      () => this.RefreshHistoryGridGrid(this.onLoad.bind(this), this.HistoryGridSateKey("gatePassOutwardGrid"), this.gatePassOutwardGrid)
    );
  }

}
