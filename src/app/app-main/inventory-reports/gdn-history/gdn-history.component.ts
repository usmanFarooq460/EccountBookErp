import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { GdnHistoryService } from "./gdn-history.service";
import { InventoryCommonService } from "../Inventorycommon.service";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { GdnHistoryModel } from "./gdn-history.model";
import notify from "devextreme/ui/notify";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { Router } from "@angular/router";

@Component({
  selector: "app-gdn-history",
  templateUrl: "./gdn-history.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class GdnHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("GDNHistoryGrid", { static: false })
  GDNHistoryGrid: DxDataGridComponent;

  @ViewChild("GdnHistoryForm", { static: false })
  GdnHistoryForm: DxFormComponent;
  GdnHistoryFormData: GdnHistoryModel;

  companyList = [];
  branchList = [];
  projectList = [];
  SupplierList :any;
  dataSource = [];

  constructor(private commonMethods:CommonMethodsForCombos,private router:Router,private service: GdnHistoryService, private commonService: CommonBaseService, private inventorycommon_service: InventoryCommonService) {
    super();
  }

  async ngOnInit() {
    this.breadCrumb("Inventory Reports", "GDN -History");

    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.SupplierList=await this.commonMethods.GenerateDataSourceFromList(await  this.commonMethods.SupplierCustomerByOrganizationAndCompany())
    this.initForm();
  }
  public initForm() {
    this.GdnHistoryFormData = new GdnHistoryModel();
    this.GdnHistoryFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.GdnHistoryFormData.ToDate = new Date();
    this.onLoad();
  }

  onLoad() {
    this.dataSource = [];
    this.ActivateLoadPanel("Loading Data..")
    this.service.Gdnhistory(this.GdnHistoryFormData).subscribe(
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
    const result: any = this.GdnHistoryForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.popoverVisible = false;
      this.ActivateLoadPanel("Loading Data..")
      this.dataSource = [];
      this.service.Gdnhistory(this.GdnHistoryFormData).subscribe(
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

  ReportSlip260() {
    if (this.GdnHistoryFormData) {
      this.service
        .InvRptGdnRiceSlip_260({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.GdnHistoryFormData.FromDate,
          ToDate: this.GdnHistoryFormData.ToDate,
          FromDocNo: this.GdnHistoryFormData.FromDocNo,
          ToDocNo: this.GdnHistoryFormData.ToDocNo,
          SupplierCustomerId: this.GdnHistoryFormData.SupplierCustomerId,

          ReportName: "260-InvRptGdnRiceSlip",
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

  ReportRegister261() {
    if (this.GdnHistoryFormData) {
      this.service
        .InvRptGdnRegister_261({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.GdnHistoryFormData.FromDate,
          ToDate: this.GdnHistoryFormData.ToDate,
          FromDocNo: this.GdnHistoryFormData.FromDocNo,
          ToDocNo: this.GdnHistoryFormData.ToDocNo,
          SupplierCustomerId: this.GdnHistoryFormData.SupplierCustomerId,

          ReportName: "261-InvRptGdnRegister",
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
    this.GdnHistoryFormData = new GdnHistoryModel();
    this.GdnHistoryFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.GdnHistoryFormData.ToDate = new Date();
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
          hint: "261-Register",
          onClick: this.ReportRegister261.bind(this),
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          id: "outstandingPaddyPurchaseOrderChartButton",
          icon: "print",
          hint: "260-Slip",
          onClick: this.ReportSlip260.bind(this),
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
      () => this.RefreshHistoryGridGrid(this.onLoad.bind(this), this.HistoryGridSateKey("GDNHistoryGrid"), this.GDNHistoryGrid)
    );
  }
}
