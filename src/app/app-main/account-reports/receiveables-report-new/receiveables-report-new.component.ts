import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { ReceivablesReportService } from "./receiveables-report-new.service";
import { ReceivablesReportModel } from "./receivables-report.model";
import ArrayStore from "devextreme/data/array_store";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { validate } from "src/app/shared/Base/validationHelper";
import { MostUsedMethods, CompanyInfo} from "src/app/shared/Base/mostUsedMethods"
@Component({
  selector: "app-receiveables-report-new",
  templateUrl: "./receiveables-report-new.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_gridHeading.scss"],
})
export class ReceiveablesReportNewComponent extends BaseActions implements OnInit {
  @ViewChild("ReceivablesReportForm", { static: false })
  ReceivablesReportForm: DxFormComponent;
  ReceivablesReportFormData: ReceivablesReportModel;
  @ViewChild("ReceivablesReportGrid", { static: false })
  ReceivablesReportGrid: DxDataGridComponent;
  branchList = [];
  projectList = [];
  ReceivablesReportDataSource = [];
  selectedAccountsTypeCodes = [];
  ParentAccountList: any;
  ThirdLevelAccountList = [];
  AccountTypesList = [];
  CityList=[];
  CityWiseReceivablesChartOptions;
    //===============================
    @Input() CompanyId: number;
    @Input() FromDate:Date;
    @Input() ToDate: Date;
    @Input() IsLoadedInPopup: boolean=false;
    MostUsedMethods: any;
    CompanyData: CompanyInfo;
    CustomerInfoVisible: boolean=false;
    SupplierCustomerIdForCustomerInfo: number;
    CompanyIdForCustomerInfo: number;
    //======================================================
    DataForCityWiseChart:any;
    ReceivablesDetailChartsPopupVisible: boolean=false;
    ReceivablesDataBreakupByCityList:Array<ReceivablesDetailChartDataByCity>=[]
    CityWiseReceivablesDetailChartData:Array<any>=[];
    CityWiseReceivablesDetailDataSource=[]
    CityWiseReceivablesDetailPopupHeading: string;
    ReceivablesTotalsArray=[];
    TopThreeReceivablesArray=[];
    ReceivableFollowupFormVisible: boolean=false;
    CompanyIdForReceivableFollowupForm: number=0;
    AccountIdForReceivableFollowupForm: number=0;
  constructor(private commonService: CommonBaseService, private commonMethods: CommonMethodsForCombos, private service: ReceivablesReportService) {
    super();
    this.MostUsedMethods=new MostUsedMethods(commonMethods);
  }
  async ngOnInit() {
    this.ActivateLoadPanel("Generating Report!")
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    let data = await this.commonMethods.AccountsTypesGetAll();
    this.CompanyData=await this.MostUsedMethods.FetchCompanyInfo(this.CompanyId>0?this.CompanyId: parseInt(sessionStorage.getItem("CompanyId")))
    this.CityList=await this.commonMethods.CityGetByOrganizationAndCompany();
    this.AccountTypesList = data.filter(({ Id }) => Id == 3 || Id == 22);
    await this.ReadAllParentGroupAccount();
    this.InitReport();
    await this.FetchReceivablesData();
    this.DeActivateLoadPanel()
  }
  InitReport() {
    this.ReceivablesReportFormData = new ReceivablesReportModel();
    this.ReceivablesReportFormData.FromDate = new Date();
    this.ReceivablesReportFormData.ToDate = new Date();
    this.ReceivablesReportFormData.ProjectId = this.projectList[0].Id;
    this.ReceivablesReportFormData.BrancheId = this.branchList[0].Id;
    this.ReceivablesReportFormData.BalanceFrom = 0;
    this.ReceivablesReportFormData.AccountTypeId = this.AccountTypesList[0].Id;
  }
  async ReadAllParentGroupAccount() {
    let data=await this.service
      .ReadAllParentGroupAccount({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: this.CompanyId>0?this.CompanyId:sessionStorage.getItem("CompanyId"),
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
  async FetchReceivablesData() {
    if (this.CompanyId>0==false?validate(this.ReceivablesReportForm):true) {
      this.DataForCityWiseChart=null;
      
      if (this.ReceivablesReportFormData.BalanceTo > 0 == false) {
        this.ReceivablesReportFormData.BalanceTo = 0;
      }
      this.ActivateLoadPanel("Fetching Report!")
      this.ReceivablesReportDataSource=await this.GetPayablesData(this.CompanyData.CompanyId,this.CompanyData.FinancialYearId);
      console.log(this.ReceivablesReportDataSource)
      //NERVER DELETE THIS
      if(this.ReceivablesReportDataSource!=null && this.ReceivablesReportDataSource!=undefined)
      {
        if(this.ReceivablesReportDataSource.length>0)
        {
  
      let TotalsArray=this.MostUsedMethods.CalculateTotalsByPropertyNames(this.ReceivablesReportDataSource,["ClDebit","LastRcvdAmount"],[{name:'ClDebit',value:0},{name:'LastRcvdAmount',value:0},])
      TotalsArray.map((item)=> item.value=parseFloat(item.value.toFixed(2)))
      this.ReceivablesTotalsArray=TotalsArray;

      this.TopThreeReceivablesArray=this.FindTopThreeReceivablesData(this.ReceivablesReportDataSource)
      this.GnerateReceivablesChartData(this.ReceivablesReportDataSource)
        }
      }

      this.DeActivateLoadPanel()
    }
  }

  FindTopThreeReceivablesData(data)
  {
    let sortedArray= this.MostUsedMethods.SortArrayInAscendingOrder(data,"ClDebit")
    let length=sortedArray.length
    let topThreeObjectsList:Array<{value: number;name: string;city:string,AccountId: number,Index:string}>=[]
    for(let i=0;i<3;i++)
    {
      topThreeObjectsList.push({
        name:sortedArray[length-1].AccountTitle,
        value:sortedArray[length-1].ClDebit,
        city: sortedArray[length-1].CityName,
        AccountId:sortedArray[length-1].AccountId,
        Index:''
      })
      length-=1
    }
    for(let i=0;i<topThreeObjectsList.length;i++)
    {
      if(i==0) topThreeObjectsList[i].Index='1st'
      if(i==1) topThreeObjectsList[i].Index='2nd'
      if(i==2) topThreeObjectsList[i].Index='3rd'
    }
    return topThreeObjectsList
  }

  async GetPayablesData(CompanyId: number,FinancialYearId: number)
  {
    let selecteds = "";
    if (this.selectedAccountsTypeCodes != null && this.selectedAccountsTypeCodes != undefined) {
      for (let i = 0; i < this.selectedAccountsTypeCodes.length; i++) {
        selecteds += "," + this.selectedAccountsTypeCodes[i] + ",";
      }
    }
    return await this.service.Receivable({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: CompanyId,
          FromDate: this.CompanyId>0?this.FromDate: this.ReceivablesReportFormData.FromDate,
          ToDate: this.CompanyId>0?this.ToDate:this.ReceivablesReportFormData.ToDate,
          FinancialYearId: FinancialYearId,
          AccountId: this.ReceivablesReportFormData.AccountTypeId,
          Status: selecteds,
          FromDocNo: this.CompanyId>0?0:this.ReceivablesReportFormData.BalanceFrom,
          ToDocNo: this.CompanyId>0?0:this.ReceivablesReportFormData.BalanceTo,
          CityId: this.ReceivablesReportFormData.CityId
    }).catch(error=>{
      this.HandleError(error);
    })
  }
  ReportRegister122() {
    this.ActivateLoadPanel("Loading Report");
    let selecteds = "";
    if (this.selectedAccountsTypeCodes != null && this.selectedAccountsTypeCodes != undefined) {
      for (let i = 0; i < this.selectedAccountsTypeCodes.length; i++) {
        selecteds += "," + this.selectedAccountsTypeCodes[i] + ",";
      }
  
    }
    this.service
      .AcRptReceivables_122({
        //Compulosry
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: this.CompanyData.CompanyId,
        FinancialYearId: this.CompanyData.FinancialYearId,
        FromDate: this.CompanyId>0?this.FromDate:this.ReceivablesReportFormData.FromDate,
        ToDate: this.CompanyId>0?this.ToDate:this.ReceivablesReportFormData.ToDate,
        FromDocNo: this.CompanyId>0?0:this.ReceivablesReportFormData.BalanceFrom,
        ToDocNo: this.CompanyId>0?0: this.ReceivablesReportFormData.BalanceTo,
        AccountId: this.ReceivablesReportFormData.AccountTypeId,
        Status: selecteds,
        CompanyAddress: this.CompanyData.CompanyAddress,
        CompanyName: this.CompanyData.CompanyName,
        ReportName: "122-AcRptAccounts_ReceivablesWithStatus",
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
  DummyMethod() {}
  onPrint(e) {
    this.ActivateLoadPanel("Loading Report!");
    this.service
      .SupplierCustomerRegister({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.CompanyData.CompanyId,
        AccountId: e.AccountId,
        CompanyAddress: this.CompanyData.CompanyAddress,
        CompanyName: this.CompanyData.CompanyName,
        ReportName: "293-InvRptSupplierSlip",
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel(), window.open(result);
        },
        (error) => {
          this.DeActivateLoadPanel(), this.HandleError(error);
        }
      );
  }
  MakeCustomerInfoPopupVisibleOnChartPalleteClick(data)
  {

    let CustomerObject=this.ReceivablesReportDataSource.find((item)=> item.AccountTitle==data.name)
    this.SupplierCustomerIdForCustomerInfo=CustomerObject.AccountId;
    this.CompanyIdForCustomerInfo=this.CompanyData.CompanyId;
    this.CustomerInfoVisible=!this.CustomerInfoVisible;
  }
  HandleCustomerInofPopupVisibility(data)
  {

    if(data!="close")
    {
          this.SupplierCustomerIdForCustomerInfo=data.AccountId;
    this.CompanyIdForCustomerInfo=this.CompanyData.CompanyId;
    }
    this.CustomerInfoVisible=!this.CustomerInfoVisible;
  }
  ReceivablesReportGridToolbar = (e) => {
    this.ReportButtonInGridToolbar(e, "122_ReceivablesReport", this.ReportRegister122.bind(this));
    this.FilterButtonInGridToolbar(e);
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(() => this.DummyMethod.bind(this), this.HistoryGridSateKey("ReceivablesReportGridState"), this.ReceivablesReportGrid));
  };
  ApprovalPopupGridToolbarPreparing=(e)=>
  {
    this.GridHeadingInToolbar(e,"CardDetailGridHeadingTemplate");
    this.FilterButtonInGridToolbar(e);
  }
  //=======================================================================================
  GnerateReceivablesChartData(data)
  {
    let CitiesList=this.GenerateHeaderData(data,"CityName")
  
    let LegendsList=[];
    let SeriesData=[]
    for(let i=0;i<CitiesList.length;i++)
    {
      LegendsList.push(CitiesList[i].CityName);
      let TotalReceivalbesAmountAgainstCityAtI:number=0;
      data.map((item)=> item.CityName==CitiesList[i].CityName?TotalReceivalbesAmountAgainstCityAtI+=item.ClDebit:TotalReceivalbesAmountAgainstCityAtI+=0)
      SeriesData.push({value:TotalReceivalbesAmountAgainstCityAtI,name:CitiesList[i].CityName})
    }
    this.DataForCityWiseChart={Legends:LegendsList,Sereis:SeriesData}
  
  }
  handleReceivablesDetailChartsPopupVisibility(e)
  {
    this.ReceivablesDetailChartsPopupVisible=!this.ReceivablesDetailChartsPopupVisible
  }
  handleChartClicked(data:{name:string,value:number})
  {

    this.ReceivablesDataBreakupByCityList=[]
    this.ReceivablesDataBreakupByCityList.push({
      CityWiseReceivablesDetailPopupHeading:data.name,
      CityWiseReceivablesDetailChartData:this.GenerateCityWiseChartData(this.ReceivablesReportDataSource,data.name),
      CityWiseReceivablesDetailDataSource:this.ReceivablesReportDataSource.filter((item)=> item.CityName==data.name)

    })
 
    this.handleReceivablesDetailChartsPopupVisibility(0)
  
  }
  handleReceivableFollowupFormVisiblility(AccountId)
  {
    console.log(AccountId)
    this.ReceivableFollowupFormVisible=!this.ReceivableFollowupFormVisible
    if(this.ReceivableFollowupFormVisible==true)
    {
      this.CompanyId>0?this.CompanyIdForReceivableFollowupForm=this.CompanyId:this.CompanyIdForReceivableFollowupForm=parseInt(sessionStorage.getItem("CompanyId"))
      this.AccountIdForReceivableFollowupForm=AccountId
    }
  }

GenerateCityWiseChartData(data,CityName)
{
  let ChartSereis:Array< {value:number,name:string}>=[]
  let ChartLegends:Array<string>=[];
  let ObjectToBeReturned:ChartData=new ChartData()
  data.map((item)=> {
    if(item.CityName==CityName)
    {
      ChartLegends.push(item.AccountTitle)
      ChartSereis.push({value:item.ClDebit,name:item.AccountTitle})
    }
  })
  ObjectToBeReturned.Legends=ChartLegends;
  ObjectToBeReturned.Series=ChartSereis
  return ObjectToBeReturned
}
}


class ReceivablesDetailChartDataByCity{
  CityWiseReceivablesDetailChartData:ChartData;
  CityWiseReceivablesDetailDataSource: Array<any>;
  CityWiseReceivablesDetailPopupHeading: string;
}
class ChartData{
  Legends:Array<string>;
  Series:Array<{value:number,name:string}>
}