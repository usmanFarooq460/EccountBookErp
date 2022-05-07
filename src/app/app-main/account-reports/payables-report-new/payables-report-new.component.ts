import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { PayablesReportService } from "./payables-report-new.service";
import { PayablesReportModel } from "./payables-report-new.model";
import ArrayStore from "devextreme/data/array_store";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { validate } from "src/app/shared/Base/validationHelper";
import { MostUsedMethods, CompanyInfo} from "src/app/shared/Base/mostUsedMethods"
@Component({
  selector: "app-payables-report-new",
  templateUrl: "./payables-report-new.component.html",
  styleUrls: [],
})
export class PayablesReportNewComponent extends BaseActions implements OnInit {
  @ViewChild("PayablesReportForm", { static: false })
  PayablesReportForm: DxFormComponent;
  PayablesReportFormData: PayablesReportModel;

  @ViewChild("PayablesReportGrid", { static: false })
  PayablesReportGrid: DxDataGridComponent;
  branchList = [];
  projectList = [];
  ReceivablesReportDataSource = [];
  selectedAccountsTypeCodes = [];
  ParentAccountList: any;
  ThirdLevelAccountList = [];
  AccountTypesList = [];
  //===============================
  @Input() CompanyId: number;
  @Input() FromDate:Date;
  @Input() ToDate: Date;
  @Input() IsLoadedInPopup: boolean=false;
  CompanyData: CompanyInfo;
  MostUsedMethods:any
  constructor(private commonService: CommonBaseService, private commonMethods: CommonMethodsForCombos, private service: PayablesReportService) {
    super();
    this.MostUsedMethods= new MostUsedMethods(commonMethods);
  }

  async ngOnInit() {
    this.ActivateLoadPanel("Generating Report!")
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.CompanyData=await this.MostUsedMethods.FetchCompanyInfo(this.CompanyId>0?this.CompanyId: parseInt(sessionStorage.getItem("CompanyId")))
    let data = await this.commonMethods.AccountsTypesGetAll();
    this.AccountTypesList = data.filter(({ Id }) => Id == 3 || Id == 22);
    await this.ReadAllParentGroupAccount();
    this.InitReport();
    await this.FetchPayablesData();
    this.DeActivateLoadPanel()
  }
  InitReport() {
    this.PayablesReportFormData = new PayablesReportModel();
    this.PayablesReportFormData.FromDate = new Date();
    this.PayablesReportFormData.ToDate = new Date();
    this.PayablesReportFormData.ProjectId = this.projectList[0].Id;
    this.PayablesReportFormData.BrancheId = this.branchList[0].Id;
    this.PayablesReportFormData.BalanceFrom = 0;
    this.PayablesReportFormData.AccountTypeId = this.AccountTypesList[0].Id;
    
  }

  async ReadAllParentGroupAccount() {
    
    let data=await this.service
      .ReadAllParentGroupAccount({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: this.CompanyData.CompanyId,
        FinancialYearId: this.CompanyData.FinancialYearId,
        Account_Level: 3,
      });
      if(data==null || data==undefined)
      {
        data=[]
      }
      this.ThirdLevelAccountList = data;
      this.ParentAccountList = new ArrayStore({
        key: "AccountCode",
        data: this.ThirdLevelAccountList.filter(({ AccountTypeId }) => AccountTypeId == this.AccountTypesList[0].Id),
      });
  }
  handleAccountTypeChanged = (e) => {
    if (e.value > 0) {
      this.ParentAccountList = new ArrayStore({
        key: "AccountCode",
        data: this.ThirdLevelAccountList.filter(({ AccountTypeId }) => AccountTypeId == e.value),
      });
    } else {
      this.ParentAccountList = null;
      this.selectedAccountsTypeCodes = [];
    }
  };
  
  async FetchPayablesData() {

    if (this.CompanyId>0==false?validate(this.PayablesReportForm):true) {
      if (this.PayablesReportFormData.BalanceTo > 0 == false) {
        this.PayablesReportFormData.BalanceTo = 0;
      }
      this.ReceivablesReportDataSource=await this.GetPayablesData(this.CompanyData.CompanyId,this.CompanyData.FinancialYearId);


    }
  }
  async GetPayablesData(CompanyId: number,FinancialYearId: number)
  {
    let selecteds = "";
    if (this.selectedAccountsTypeCodes != null && this.selectedAccountsTypeCodes != undefined) {
      for (let i = 0; i < this.selectedAccountsTypeCodes.length; i++) {
        selecteds += "," + this.selectedAccountsTypeCodes[i] + ",";
      }
    }
    return await this.service.Payables({
                OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: CompanyId,
          FromDate: this.CompanyId>0?this.FromDate: this.PayablesReportFormData.FromDate,
          ToDate: this.CompanyId>0?this.ToDate:this.PayablesReportFormData.ToDate,
          FinancialYearId: FinancialYearId,
          AccountId: this.PayablesReportFormData.AccountTypeId,
          Status: selecteds,
          FromDocNo: this.CompanyId>0?0:this.PayablesReportFormData.BalanceFrom,
          ToDocNo: this.CompanyId>0?0:this.PayablesReportFormData.BalanceTo,
    })
  }

  ReportRegister141() {
    if (this.CompanyId>0==false?validate(this.PayablesReportForm):true) {
      this.ActivateLoadPanel("Loading Report");
      let selecteds = "";
      if (this.selectedAccountsTypeCodes != null && this.selectedAccountsTypeCodes != undefined) {
        for (let i = 0; i < this.selectedAccountsTypeCodes.length; i++) {
          selecteds += "," + this.selectedAccountsTypeCodes[i] + ",";
        }
      }

      this.service
        .AcRptPayables_141({
          //Compulosry
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          FromDate: this.CompanyId>0?this.FromDate: this.PayablesReportFormData.FromDate,
          ToDate: this.CompanyId>0?this.ToDate:this.PayablesReportFormData.ToDate,
          FromDocNo: this.CompanyId>0?0:this.PayablesReportFormData.BalanceFrom,
          ToDocNo: this.CompanyId>0?0:this.PayablesReportFormData.BalanceTo,
          AccountId: this.PayablesReportFormData.AccountTypeId,
          Status: selecteds,
          CompanyAddress: this.CompanyData.CompanyAddress,
          CompanyName: this.CompanyData.CompanyName,
          ReportName: "141-AccountPayablesWithLastBillAmountAndDate",
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
    } else {
      this.ErrorPopup("Record not Found");
      // notify("Record Not Found", "error");
    }
  }
  DummyMethod() {}

  ReceivablesReportGridToolbar = (e) => {
    this.ReportButtonInGridToolbar(e, "141_PayablesReport", this.ReportRegister141.bind(this));
    this.FilterButtonInGridToolbar(e);
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(() => this.DummyMethod.bind(this), this.HistoryGridSateKey("ReceivablesReportGridState"), this.PayablesReportGrid));
  };
}
