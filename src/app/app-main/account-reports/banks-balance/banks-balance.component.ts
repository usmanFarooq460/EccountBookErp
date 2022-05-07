import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { BanksBalanceService } from "./banks-balance.service";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { banksBalanceModel } from "./banks-balance.model";
import { MostUsedMethods, CompanyInfo } from "src/app/shared/Base/mostUsedMethods";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { typeWithParameters } from "@angular/compiler/src/render3/util";
import { runInThisContext } from "vm";
// import { banksBalanceModel } from "./banks-balance.model";
@Component({
  selector: "app-banks-balances-report",
  templateUrl: "./banks-balance.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class BanksBalanceComponent extends BaseActions implements OnInit {
  
  @ViewChild("bankBalanceSummary", { static: false })
  bankBalanceSummary: DxDataGridComponent;
  @ViewChild("BanksPaymentGrid", { static: false })
  BanksPaymentGrid: DxDataGridComponent;
  @ViewChild("BanksReceiptsGrid", { static: false })
  BanksReceiptsGrid: DxDataGridComponent;

  @ViewChild("banksBalanceForm", { static: false })
  banksBalanceForm: DxFormComponent;
  banksBalanceFormData: banksBalanceModel;
  accountTypes = [];
  accountTitle = [];
  accountSummary = [];
  bankPaymentList;
  bankReceiptList;
  accountGroupId;
  //===========================================================
  @Input() CompanyId: number;
  @Input() FromDate:Date;
  @Input() ToDate: Date;
  @Input() IsLoadedInPopup: boolean=false;
  CompanyData: CompanyInfo;
  MostUsedMethods: any

  constructor(private service: BanksBalanceService,private commonMethods: CommonMethodsForCombos ,private commonService: CommonBaseService) {
    super();
    this.MostUsedMethods=new MostUsedMethods(commonMethods);
  }

  async ngOnInit() {
    this.breadCrumb("Account Reports", "Banks Balance");
    this.CompanyData=await this.MostUsedMethods.FetchCompanyInfo(this.CompanyId>0?this.CompanyId: parseInt(sessionStorage.getItem("CompanyId")))
    this.accountGroupId=await this.commonMethods.GetConfigurationByOrgCompandConfigDescription("Bank Control Account");
    this.InitForm();
    await this.FetchData();
  }
  InitForm() {
    this.banksBalanceFormData = new banksBalanceModel();
    this.banksBalanceFormData.FromDate = new Date();
    this.banksBalanceFormData.ToDate = new Date();

  }

  clear() {
    this.InitForm();
  }

  onToolPreparingOfItemHistoryGrid = (e) => {
    this.ReportButtonInGridToolbar(e, "591-Trial Balane Selected Group Report", this.ReportRegister591.bind(this));
    this.FilterButtonInGridToolbar(e);
    this.RefreshHistoryGridGrid(() => this.DummyMethod.bind(this), this.HistoryGridSateKey("bankBalanceSummary"), this.bankBalanceSummary);
  };

  // Summary Grid :
  async GetBankPaymentsAndReceipts(CompanyId:number, FinancialYearId: number)
  {
    let Data=await this.service.GetBankPaymentReceipt({
              OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId:CompanyId,
        FinancialYearId: FinancialYearId,
        FromDate: this.CompanyId>0?this.FromDate:this.banksBalanceFormData.FromDate,
        ToDate: this.CompanyId>0?this.ToDate:this.banksBalanceFormData.ToDate,
    })
    let flag=false;
    if(Data!=null && Data!=undefined)
    {
      if(Data.length>0)
      {
        flag=true;
      }
    }
    if(flag==true)
    {
      this.bankPaymentList = Data.filter(({ TranType }) => TranType == "Payments");
            this.bankReceiptList = Data.filter(({ TranType }) => TranType == "Receipts");
    }
    else {
      this.bankPaymentList=[]
      this.bankReceiptList=[]
    }
  }
  async GetSummaryData(CompanyId: number,FinancialYearId: number)
  {
    let data=await this.service.SelectedAccountsSummary({
      FinancialYearId: FinancialYearId,
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: CompanyId,
      FromDate: this.CompanyId>0?this.FromDate: this.banksBalanceFormData.FromDate,
      ToDate: this.CompanyId>0?this.ToDate:this.banksBalanceFormData.ToDate,
      AccountTypeId: 15,
    })
    this.accountSummary=data;
  }

  async FetchData()
  {
    this.ActivateLoadPanel("Generating Report!")
    await this.GetBankPaymentsAndReceipts(this.CompanyData.CompanyId, this.CompanyData.FinancialYearId);
    await this.GetSummaryData(this.CompanyData.CompanyId, this.CompanyData.FinancialYearId);
    this.DeActivateLoadPanel();

  }

  ReportRegister591() {
    this.ActivateLoadPanel("Loading Report");
    this.service
      .AcRptTrialBalanceSelectedGroupAc_591({
        //Compulosry
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId:this.CompanyData.CompanyId,
        CompanyAddress: this.CompanyData.CompanyAddress,
        CompanyName:this.CompanyData.CompanyName,
        FromDate: this.CompanyId>0?this.FromDate:this.banksBalanceFormData.FromDate,
        ToDate: this.CompanyId>0?this.ToDate:this.banksBalanceFormData.ToDate,
        FinancialYearId: this.CompanyData.FinancialYearId,
        GroupAccountId: this.accountGroupId,
        ReportName: "591-AcRptTrialBalanceSelectedGroupAc",
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

  ReportRegister590() {
    this.ActivateLoadPanel("Loading Report");
    this.service
      .BankBalances_590({
        //Compulosry
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.CompanyData.CompanyId,
        CompanyAddress: this.CompanyData.CompanyAddress,
        CompanyName: this.CompanyData.CompanyName,
        FromDate: this.CompanyId>0?this.FromDate:this.banksBalanceFormData.FromDate,
        ToDate: this.CompanyId>0?this.ToDate:this.banksBalanceFormData.ToDate,
        FinancialYearId: this.CompanyData.FinancialYearId,
        ReportName: "590-BankBalances",
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




  // ================================Bank Payments ================= //
  DummyMethod()
  {}
  toolbarOfBanksPayments = (e) => {
    this.ReportButtonInGridToolbar(e, "590-Bank Balance Report", this.ReportRegister590.bind(this));
    this.FilterButtonInGridToolbar(e);
    this.RefreshHistoryGridGrid(() => this.DummyMethod.bind(this), this.HistoryGridSateKey("BanksPaymentGrid"), this.BanksPaymentGrid);
  };
  // =========================   Banks Receipts  ================

  toolbarOfBanksReceipts = (e) => {
    this.FilterButtonInGridToolbar(e);
    this.RefreshHistoryGridGrid(() => this.DummyMethod.bind(this), this.HistoryGridSateKey("BanksReceiptsGrid"), this.BanksReceiptsGrid);
  };
}
