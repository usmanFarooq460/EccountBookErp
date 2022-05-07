import { Component, OnInit, ViewChild,Input, Output, EventEmitter } from '@angular/core';
import { BaseActions } from 'src/app/shared/Base/BaseActions';
import { InvoiceHistoryService } from './invoice-history.service';
import { InvoiceDataType, InvoiceDetailType } from 'src/app/shared/Base/mostUsedMethods';
import { ShortcutKeysService } from "src/app/shared/Base/shortcut-Keys.service";
import { take } from "rxjs/operators";
import { DxFormComponent } from 'devextreme-angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-invoice-history',
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.scss']
})
export class InvoiceHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("ItemFilterationForm", {static: false})
  ItemFilterationForm:DxFormComponent;
  ItemFilterationFormData:ItemFilterationFormDataModel
  //#region Inputs and Outputs
  @Input() CompanyId: number;
  @Input() DataSource: Array<InvoiceDataType>;
  @Input() FormRoute: string;
  @Input() HistoryTitle: string
  @Input() InvoiceSlipButton1Hint: string;
  @Input() InvoiceSlipButton2Hint: string;
  @Input() InvoiceSlipButton3Hint: string;
  @Input() InvoiceSlipButton4Hint: string;
  @Input() InvoiceSlipButton3Visible: boolean;
  @Input() InovoiceSlipButton2Visible: boolean;
  @Input() InvoiceSlipButton4Visible: boolean;

  @Output() InvoiceSlipButton1Click=new EventEmitter()
  @Output() InvoiceSlipButton2Click=new EventEmitter()
  @Output() InvoiceSlipButton3Click=new EventEmitter()
  @Output() InvoiceSlipButton4Click=new EventEmitter()
  @Output() InvoiceLoadAllRecordsButtonClick=new EventEmitter();
  //#endregion
  //#region ConditionalVariables
  InvoicePreviewVisible: boolean=false;
  InvoiceData: InvoiceDataType;
  OrginalDataSourceHolder:Array<InvoiceDataType>;
  CompanyIdToFetchCompanyIfnoInInvoicePreview: number;
  FilterBoxValue: string;
  SpecialLoadPanelVisible: boolean=false
  //#endregion
  constructor(private service:InvoiceHistoryService,private router:Router,private keyboardShourtcuts: ShortcutKeysService) { 
    super();
    this.keyboardShourtcuts
    .addShortcut({ keys: "shift.p" })
    .pipe(take(1000))
    .subscribe((result) => {
      this.printReport();
    });
    this.OrginalDataSourceHolder=this.DataSource
  }
  ngOnInit() {
    this.CompanyId>0?this.CompanyIdToFetchCompanyIfnoInInvoicePreview=this.CompanyId:this.CompanyIdToFetchCompanyIfnoInInvoicePreview=parseInt(sessionStorage.getItem("CompanyId"))
  }
  GoToForm()
  {
    this.router.navigate([this.FormRoute]);
  }
  InvoiceSlip1Click()
  {
    this.InvoiceSlipButton1Click.emit(this.InvoiceData);
  }
  InvoiceSlip2Click()
  {
    this.InvoiceSlipButton2Click.emit(this.InvoiceData);
  }
  InvoiceSlip3Click()
  {
    this.InvoiceSlipButton3Click.emit(this.InvoiceData);
  }
  InvoiceSlip4Click()
  {

    this.InvoiceSlipButton4Click.emit(this.InvoiceData);
  }
  LoadAllRecordButtonClick()
  {
    this.InvoiceLoadAllRecordsButtonClick.emit("1")
  }
  setDataInOriginalDataSourceHolder(data)
  {
    this.OrginalDataSourceHolder=data
  }
  // FilterData = (e) => {
  //   let value=e.value.toLowerCase();
    
  //   if (value!=null && value != "" && value!=undefined) {
  //     let PropertiesList=Object.keys(this.DataSource[0]);
  //     let FilterResult=[]
  //     for(let i=0;i<this.OrginalDataSourceHolder.length;i++)
  //     {
  //       for(let j=0;j<PropertiesList.length;j++)
  //       {
  //         if(typeof(this.OrginalDataSourceHolder[i][PropertiesList[j]])!='object')
  //         {
  //           let valueToBeCompared=this.OrginalDataSourceHolder[i][PropertiesList[j]];
  //           if(typeof(valueToBeCompared)=='number')
  //           {
  //             valueToBeCompared=valueToBeCompared.toString()
  //           }
  //           valueToBeCompared=valueToBeCompared.toLowerCase()
  //           if(valueToBeCompared.includes(value)){
  //             FilterResult.push(this.OrginalDataSourceHolder[i]);
  //             break;
  //           }
  //         }
  //       }
  //     }
  //     this.DataSource=FilterResult;
      
  //   } else {
  //     this.DataSource=this.OrginalDataSourceHolder;
  //   }
  // };
   printReport() 
   {
  // var divToPrint = document.getElementById("showInPrint").outerHTML; 
  // var popupWin = window.open('', '_blank'); 
  // popupWin.document.open(); 
  // popupWin.document.write('<html><body onload="window.print()">' + divToPrint + '</html>'); 
  // popupWin.document.close(); 
}
handleFilterBoxValueChanged()
{

}
 printElement() {
    // var printHtml = document.getElementById("showInPrint");
    // var currentPage = document.body.innerHTML;
    // var elementPage = '<html> <head><title></title></head><body>' + printHtml + '</body></html>';
    //change the body
    // document.body.innerHTML = elementPage;
    // document.getElementById("printContainer").append(printHtml);
    //print
    // window.print();
    // document.getElementById("InvoiceBox").append(printHtml);
  //   while(elements.length > 0){
  //     elements[0].parentNode.removeChild(elements[0]);
  // }
  //   document.getElementById("printContainer").removeChild()
    //go back to the original
    // document.body.innerHTML = currentPage;
}

GeneratePreview(data)
{
 
  this.SpecialLoadPanelVisible=true;
  this.InvoiceData=new InvoiceDataType();
  this.InvoiceData=data;
  this.InvoicePreviewVisible=false;
  setTimeout(() => {
    this.SpecialLoadPanelVisible=false;
    this.InvoicePreviewVisible=true
  }, 1000);
}

}



class ItemFilterationFormDataModel{
  FilterBoxValue: string
}