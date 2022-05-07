import { Component, HostListener, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { FcyPayablesRecievablesRptService } from "./fcy_Payables_Recievables_Rpt.service";
import { FcyPayablesRecieablesRptModel, DataSourceModel } from "./fcy_Payables_Recievables_Rpt.model";
import { Router } from "@angular/router";
@Component({
  selector: "app-fcy-PayablesRecievablesReport",
  templateUrl: "./fcy_Payables_Recievables_Rpt.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class FcyPayablesRecievablesRptComponent extends BaseActions implements OnInit {
  @Input() IsLoadedInPopup: boolean = false;
  @ViewChild("fcyPayAbleReceivableGrid", { static: false })
  fcyPayAbleReceivableGrid: DxDataGridComponent;
  @ViewChild("FcyPayablesRecievablesRptForm", { static: false })
  FcyPayablesRecievablesRptForm: DxFormComponent;
  FcyPayablesRecievablesRptFormData: FcyPayablesRecieablesRptModel;
  dataSource = new Array<DataSourceModel>();
  branchList = [];
  projectList = [];
  AccountTypeList = [];
  ledgerDataSource = [];
  //===================================================
  ApprovalPopupHeight: number = window.innerHeight - 150;
  ApprovalPopupWidth: number = window.innerWidth - 150;
  ApprovalPopupGridWidth: number = window.innerWidth - 200;
  ApprovalPopupGridHeight: number = window.innerHeight - 220;
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    event.target.innerWidth;
    let height = event.target.innerHeight;
    let width = event.target.innerWidth;
    this.ApprovalPopupHeight = height - (height * 20) / 100;
    this.ApprovalPopupWidth = width - (width * 20) / 100;
    this.ApprovalPopupGridWidth = width - (width * 23) / 100;
    this.ApprovalPopupGridHeight = height - (height * 27) / 100;
  }
  //-----------------------------------------------------
  ledgerPopupVisible: boolean = false;
  ledgerPopupTitle: string;
  constructor(private router: Router, private service: FcyPayablesRecievablesRptService, private commonService: CommonBaseService) {
    super();
  }
  async ngOnInit() {
    this.breadCrumb("Acconts Reports", "Fcy Payables_Recievables");
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.filtering();
    this.initForm();
  }
  public initForm() {
    this.FcyPayablesRecievablesRptFormData = new FcyPayablesRecieablesRptModel();
    this.FcyPayablesRecievablesRptFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.FcyPayablesRecievablesRptFormData.ToDate = new Date();
    this.LatestCurrencyRatesGet();
  }
  clear() {
    this.initForm();
  }

  onToolPreparingOfItemHistoryGrid = (e) => {
    this.FilterButtonInGridToolbar(e);
    this.RefreshHistoryGridGrid(() => this.GetData.bind(this), this.HistoryGridSateKey("chartOfAccountGrid"), this.fcyPayAbleReceivableGrid);
  };
  LatestCurrencyRatesGet() {
    this.service
      .LatestCurrencyRates({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          if (result != null || result != undefined) {
            for (let i = 0; i < result.length; i++) {
              if (result[i].CurrencyCode == "EU") {
                this.FcyPayablesRecievablesRptFormData.ExchangeRateEURO = result[i].fcRate;
              } else if (result[i].CurrencyCode == "USD") {
                this.FcyPayablesRecievablesRptFormData.ExchangeRateUSD = result[i].fcRate;
              }
            }
          } else {
            result = [];
          }
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  GetData() {
    this.ActivateLoadPanel("fetching Data");
    this.service
      .FcyPayablesRecievablesGetAll({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        FromDate: this.FcyPayablesRecievablesRptFormData.FromDate,
        ToDate: this.FcyPayablesRecievablesRptFormData.ToDate,
        AccountTypeId: 22,
        ExchangeRateUSD: parseInt(this.FcyPayablesRecievablesRptForm.instance.getEditor("ExchangeRateUSD").option("text")),
        ExchangeRateEURO: parseInt(this.FcyPayablesRecievablesRptForm.instance.getEditor("ExchangeRateEURO").option("text")),
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.dataSource = [];
          if (result == null || result == undefined) {
            result = [];
          }
          for (let i = 0; i < result.length; i++) {
            let rate = 0;
            if (result[i].CurrencyCode == "EU") {
              rate = this.FcyPayablesRecievablesRptFormData.ExchangeRateEURO;
            } else if (result[i].CurrencyCode == "USD") {
              rate = this.FcyPayablesRecievablesRptFormData.ExchangeRateUSD;
            }
            this.dataSource.push({
              Id: result[i].id,
              AccountTitle: result[i].AccountTitle,
              CurrencyCode: result[i].CurrencyCode,
              CurrencyRate: rate,
              USD_AmountDr: result[i].USD_AmountDr,
              Euro_AmountDr: result[i].Euro_AmountDr,
              USD_AmountCr: result[i].USD_AmountCr,
              Euro_AmountCr: result[i].Euro_AmountCr,
              USD_Balance: result[i].USD_Balance,
              Euro_Balance: result[i].Euro_Balance,
              PKR_Amount: result[i].PKR_Amount,
            });
          }
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }

  //====================================
  loadLedgerPopup(e) {
    this.ledgerDataSource = [];
    if (this.ledgerPopupVisible == false) {
      this.ledgerPopupTitle = e.AccountTitle;
      this.showLedgerAgainstAccountId(e);
    }
    this.ledgerPopupVisible = !this.ledgerPopupVisible;
  }
  showLedgerAgainstAccountId(e) {
    this.service
      .FCY_LedgerAgainstAccountId({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        FromDate: this.FcyPayablesRecievablesRptFormData.FromDate,
        ToDate: this.FcyPayablesRecievablesRptFormData.ToDate,
        AccountTypeId: 22,
        ExchangeRateUSD: parseInt(this.FcyPayablesRecievablesRptForm.instance.getEditor("ExchangeRateUSD").option("text")),
        ExchangeRateEURO: parseInt(this.FcyPayablesRecievablesRptForm.instance.getEditor("ExchangeRateEURO").option("text")),
        AccountId: e.Id,
      })
      .subscribe(
        (result) => {
          this.ledgerDataSource = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  onLedgerPrint = (e) => {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .getFcyVoucherPdfReport({
        //Compulosry
        AccountId: e.Id,
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        FromDate: this.FcyPayablesRecievablesRptFormData.FromDate,
        ToDate: this.FcyPayablesRecievablesRptFormData.ToDate,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "133-FcyCustomerLedger",
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
  };

  //===================================
  onSubmit() {
    const result: any = this.FcyPayablesRecievablesRptForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      if (this.FcyPayablesRecievablesRptFormData.ExchangeRateEURO > 0 == false || this.FcyPayablesRecievablesRptFormData.ExchangeRateUSD > 0 == false) {
        this.ErrorPopup("Please Enter Exchange Rate");
        // notify("Please Enter Exchange Rate", "error");
      } else if (this.FcyPayablesRecievablesRptFormData.ExchangeRateUSD > 0 && this.FcyPayablesRecievablesRptFormData.ExchangeRateEURO > 0) {
        this.GetData();
      }
    }
  }
}
