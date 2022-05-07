import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { FcyLedgerService } from "./fcy-ledger.service";
import { FcyLedgerModel } from "./fcy-ledger.model";
import { validate } from "src/app/shared/Base/validationHelper";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-fcy-ledger",
  templateUrl: "./fcy-ledger.component.html",
  styleUrls: ["./fcy-ledger.component.scss"],
})
export class FcyLedgerComponent extends BaseActions implements OnInit {
  @ViewChild("FcyGeneralLedgerGrid", { static: false })
  FcyGeneralLedgerGrid: DxDataGridComponent;
  @ViewChild("FcyLedgerForm", { static: false })
  FcyLedgerForm: DxFormComponent;
  FcyLedgerFormData: FcyLedgerModel;
  ledgerDataSource = [];
  AccountList: any;

  constructor(private service: FcyLedgerService, private commonMethods: CommonMethodsForCombos) {
    super();
  }

  async ngOnInit() {
    this.breadCrumb("Account Report", "Fcy General Ledger");
    this.AccountList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetAccountsIncludingAccountTypeIds("22"));
    console.log(this.AccountList);
    this.FcyLedgerFormData = new FcyLedgerModel();
    this.FcyLedgerFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.FcyLedgerFormData.ToDate = new Date();
  }
  onReportClick(data) {
    if (validate(this.FcyLedgerForm)) {
      this.ActivateLoadPanel("Loading Report");
      this.service
        .FcyGeneralLedger_156({
          //Compulosry
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          FromDate: this.FcyLedgerFormData.FromDate,
          ToDate: this.FcyLedgerFormData.ToDate,
          AccountId: this.FcyLedgerFormData.AccountId,
          AccountTypeId: null,
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),

          ReportName: "156-FcyGeneralLedger",
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            window.open(result);
          },
          (error) => {
            this.DeActivateLoadPanel();
            this.HandleError(error);
          }
        );
    }
  }

  showLedgerAgainstAccountId() {
    if (validate(this.FcyLedgerForm)) {
      this.ActivateLoadPanel("Generating Ledger!");
      this.service
        .FCY_LedgerAgainstAccountId({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          FromDate: this.FcyLedgerFormData.FromDate,
          ToDate: this.FcyLedgerFormData.ToDate,
          AccountTypeId: 22,
          AccountId: this.FcyLedgerFormData.AccountId,
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            console.log(result);
            this.ledgerDataSource = result;
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
    this.ReportButtonInGridToolbar(e, "156_FcyGeneralLedgerReport", this.onReportClick.bind(this));
    this.FilterButtonInGridToolbar(e);
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("FcyGeneralLedgerRptGridState"), this.FcyGeneralLedgerGrid));
  };
}
