import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { ApprovalDashboardService } from "./unbalanced-voucher-dashboard.service";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseActions } from "src/app/shared/Base/BaseActions";

@Component({
  selector: "app-unbalanced-voucher-dashboard",
  templateUrl: "./unbalanced-voucher-dashboard.component.html",
  styleUrls: ["./unbalanced-voucher-dashboard.component.scss"],
})
export class UnbalancedVoucherDashboardComponent extends BaseActions implements OnInit {
  @ViewChild("UnbalancedHistoryGrid", { static: false })
  UnbalancedHistoryGrid: DxDataGridComponent;
  @ViewChild("UnbalancedTrailHistoryGrid", { static: false })
  UnbalancedTrailHistoryGrid: DxDataGridComponent;
  @ViewChild("SupplierAsReceiveAbleGrid", { static: false })
  SupplierAsReceiveAbleGrid: DxDataGridComponent;

  @ViewChild("UnbalancedVoucherDashboardForm", { static: false })
  UnbalancedVoucherDashboardForm: DxFormComponent;
  UnbalancedVoucherDashboardFormData: any;
  InventoryTableDataSource = [];
  AccountsTabledataSource = [];
  SupplierDebitdataSource = [];

  searchFilter1: boolean;
  searchFilter2: boolean;

  constructor(private service: ApprovalDashboardService, private router: Router) {
    super();
    this.popoverVisible = false;
  }

  ngOnInit(): void {
    this.breadCrumb("Unbalanced Voucher Dashboard", "");
    this.UnbalancedVoucherDashboardFormData = {
      fromDate: sessionStorage.getItem("StartPeriod"),
      toDate: new Date(),
    };
    this.onSubmit();
  }
  setFocus = (e) => setTimeout(() => e.component.focus(), 0);
  //GetAccountsUnbalancee

  //GetAccountsUnApproved
  onSubmit() {
    this.GetAccountsUnbalanced();
    this.GetInventoryUnbalanced();
    this.GetSupplierDebitBalance();
  }
  //GetInventoryUnApproved
  GetAccountsUnbalanced() {
    this.ActivateLoadPanel("Loading Data..");
    this.service
      .ReadUnbalancedVoucherDashboard({
        fromDate: this.UnbalancedVoucherDashboardFormData.fromDate,
        toDate: this.UnbalancedVoucherDashboardFormData.toDate,
        ActivityId: "1",
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.AccountsTabledataSource = result;
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
  GetInventoryUnbalanced() {
    this.ActivateLoadPanel("Loading Data..");
    this.service
      .ReadUnbalancedVoucherDashboard({
        fromDate: this.UnbalancedVoucherDashboardFormData.fromDate,
        toDate: this.UnbalancedVoucherDashboardFormData.toDate,
        ActivityId: "2",
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.InventoryTableDataSource = result;
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
  GetSupplierDebitBalance() {
    this.ActivateLoadPanel("Loading Data..");
    this.service
      .ReadUnbalancedVoucherDashboard({
        fromDate: this.UnbalancedVoucherDashboardFormData.fromDate,
        toDate: this.UnbalancedVoucherDashboardFormData.toDate,
        ActivityId: "3",
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.SupplierDebitdataSource = result;
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

  onToolPreparingofUnbalancedHistoryGrid = (e) => {
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.GetInventoryUnbalanced(),
      () => this.RefreshHistoryGridGrid(this.GetInventoryUnbalanced.bind(this), this.HistoryGridSateKey("ReceiveAbleFollowUpGrid"), this.UnbalancedHistoryGrid)
    );
  };

  // ==========================ToolBar For Unbalanced Trial=========================//
  filteringUnbalancedTrailHistoryGrid() {
    this.searchFilter1 = !this.searchFilter1;
  }
  onToolPreparingofUnbalancedTrailHistoryGrid = (e) => {
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filteringUnbalancedTrailHistoryGrid(),
      () => this.GetAccountsUnbalanced(),
      () => this.RefreshHistoryGridGrid(this.GetAccountsUnbalanced.bind(this), this.HistoryGridSateKey("UnbalancedTrailHistoryGrid"), this.UnbalancedTrailHistoryGrid)
    );
  };

  // ===================== toolBar for  Supplier As Receivable ========================//

  filteringofSupplierAsReceiveAbleGrid() {
    this.searchFilter2 = !this.searchFilter2;
  }
  onToolPreparingofSupplierAsReceiveAbleGrid = (e) => {
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filteringofSupplierAsReceiveAbleGrid(),
      () => this.GetSupplierDebitBalance(),
      () => this.RefreshHistoryGridGrid(this.GetSupplierDebitBalance.bind(this), this.HistoryGridSateKey("SupplierAsReceiveAbleGrid"), this.SupplierAsReceiveAbleGrid)
    );
  };
}
