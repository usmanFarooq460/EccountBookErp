import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { BanksBalanceService } from "./cash-balances.service";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { banksBalanceModel } from "./cash-balances.model";
import { CommonMethodsForCombos} from "src/app/shared/Base/common-methods-for-combos"
// import { banksBalanceModel } from "./banks-balance.model";
import { MostUsedMethods, CompanyInfo} from "src/app/shared/Base/mostUsedMethods"
@Component({
  selector: "app-cash-balances-report",
  templateUrl: "./cash-balances.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class CashBalancesComponent extends BaseActions implements OnInit {
  @ViewChild("cashBalanceGrid", { static: false })
  cashBalanceGrid: DxDataGridComponent;
  @ViewChild("CashRceiptGrid", { static: false })
  CashRceiptGrid: DxDataGridComponent;
  @ViewChild("CashPaymentsGrid", { static: false })
  CashPaymentsGrid: DxDataGridComponent;
  @ViewChild("CashBalancesForm", { static: false })
  CashBalancesForm: DxFormComponent; 
  CashBalancesFormData: banksBalanceModel;
  //#region DataVariables
  accountSummary = [];
  bankPaymentList=[];
  bankReceiptList=[];
  //#endregion
  @Input() CompanyId: number;
  @Input() FromDate:Date;
  @Input() ToDate: Date;
  @Input() IsLoadedInPopup: boolean=false;
  MostUsedMethods: any;
  CompanyData: CompanyInfo;
  constructor(private service: BanksBalanceService,private commonMethods: CommonMethodsForCombos, private commonService: CommonBaseService) {
    super();
    this.filter = false;
    this.popoverVisible = false;
    this.MostUsedMethods=new MostUsedMethods(commonMethods);
  }
  async ngOnInit() {
    this.ActivateLoadPanel("Initializing Report")
    this.breadCrumb("Account Reports", "Cash Balance");
    this.CompanyData= await this.MostUsedMethods.FetchCompanyInfo(this.CompanyId>0?this.CompanyId: parseInt(sessionStorage.getItem("CompanyId")))
    console.log(this.CompanyData)
    this.InitForm();
    this.DeActivateLoadPanel()
    await this.FetchData()
  }
  InitForm() {
    this.CashBalancesFormData = new banksBalanceModel()
    this.CashBalancesFormData.fromDate = new Date(sessionStorage.getItem("StartPeriod")) ;
    this.CashBalancesFormData.toDate = new Date();
  }
  filtering() {
    this.filter = !this.filter;
  }
  toggle() {
    this.popoverVisible = !this.popoverVisible;
  }
  clear() {
    (this.CashBalancesFormData.fromDate = new Date(sessionStorage.getItem("StartPeriod"))), (this.CashBalancesFormData.toDate = new Date());
  }
  onToolPreparingOfItemHistoryGrid = (e) => {
    this.FilterButtonInGridToolbar(e)
    this.RefreshButtonInGridToolbar(e, ()=> this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("cashBalance"), this.cashBalanceGrid))
  };
  // Summary Grid :
  async GetPaymentsReceiptsSummay(CompanyId: number, FinancialYearId: number)
  {
    return await this.service.SelectedAccountsSummary({
        FinancialYearId: FinancialYearId,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: CompanyId,
        FromDate: this.CompanyId>0?this.FromDate: this.CashBalancesFormData.fromDate,
        ToDate: this.CompanyId>0?this.ToDate: this.CashBalancesFormData.toDate,
        AccountTypeId: 2,
        ApprovedFilter: 'All'
    });
  }
  async GetPaymentAndReceiptList(CompanyId: number,FinancialYearId: number)
  {
    return await this.service.GetCashPaymentReceipt({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: CompanyId,
        FinancialYearId: FinancialYearId,
        FromDate: this.CompanyId>0?this.FromDate: this.CashBalancesFormData.fromDate,
        ToDate: this.CompanyId>0?this.ToDate: this.CashBalancesFormData.toDate,
    })
  }
  async FetchData()
  {
    this.ActivateLoadPanel("Generating Report!")
    let ReceiptsAndPaymentsList=await this.GetPaymentAndReceiptList(this.CompanyData.CompanyId,this.CompanyData.FinancialYearId);
    if(ReceiptsAndPaymentsList!=null && ReceiptsAndPaymentsList!=undefined)
    {
      if(ReceiptsAndPaymentsList.length>0)
      {
        this.bankPaymentList = ReceiptsAndPaymentsList.filter(({ TranType }) => TranType == "Payments");
        this.bankReceiptList = ReceiptsAndPaymentsList.filter(({ TranType }) => TranType == "Receipts");
      }
    }
    let ReceiptsAndPaymentsSummary=await this.GetPaymentsReceiptsSummay(this.CompanyData.CompanyId,this.CompanyData.FinancialYearId);
    console.log(ReceiptsAndPaymentsSummary);
    this.accountSummary=ReceiptsAndPaymentsSummary;
    this.DeActivateLoadPanel();
  }
  onSubmit() {
  }
  // ====================== Cash receipt =================//
  searchFilter1: boolean;
  searchFilter2: boolean;
  filteringCashReceipt() {
    this.searchFilter1 = !this.searchFilter1;
  }
  toolbarOfCashReceipt = (e) => {
    this.FilterButtonInGridToolbar(e)
    this.RefreshButtonInGridToolbar(e,()=>this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("CashRceiptGrid"), this.CashRceiptGrid))
  };
  filteringCashPayments() {
    this.searchFilter2 = !this.searchFilter2;
  }
  DummyMethod()
  {
  }
  toolbarOfCashPayments = (e) => {
    this.FilterButtonInGridToolbar(e);
    this.RefreshButtonInGridToolbar(e,()=>this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("CashPaymentsGrid"), this.CashPaymentsGrid))
  };
}
