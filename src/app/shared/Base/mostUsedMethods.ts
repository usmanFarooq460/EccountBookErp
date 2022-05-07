import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { ShortcutKeysService } from "src/app/shared/Base/shortcut-Keys.service";
import { take } from "rxjs/operators";
export class MostUsedMethods {
  constructor(private commonMethods: CommonMethodsForCombos, private shortcutKeys?:ShortcutKeysService) {}
  public CompanyInfo: CompanyInfo = new CompanyInfo();
  public SupplierCustomerData: CustomerDataType;
  public async FetchCompanyInfo(CompanyId: number) {
    let companyInfo = await this.commonMethods.CompanyGetById(CompanyId);
    if (companyInfo != null && companyInfo != undefined) {
      this.CompanyInfo.CompanyAddress = companyInfo.CompAddress;
      this.CompanyInfo.CompanyName = companyInfo.CompName;
      this.CompanyInfo.CompanyId = companyInfo.Id;
      this.CompanyInfo.CompanyPhoneNumber = companyInfo.CompMobileA;
      this.CompanyInfo.CompanyEmail = companyInfo.CompEmailA;
    }
    let FinancialYearData = await this.commonMethods.FinancialYearIdByCompanyId(CompanyId);
    if (FinancialYearData != null && FinancialYearData != undefined) {
      this.CompanyInfo.FinancialYearId = FinancialYearData.Id;
    }
    return this.CompanyInfo;
  }
  public async FetchCustomerData(CompanyId: number, SupplierCustomerId: number) {
    this.SupplierCustomerData = new CustomerDataType();
    let data = await this.commonMethods.GetSupplierCustomerInfo(CompanyId, SupplierCustomerId);
    this.SupplierCustomerData.CustomerName = data[0].AccountTitle;
    this.SupplierCustomerData.CustomerEmail = data[0].Email;
    this.SupplierCustomerData.CustomerPhoneNumber = data[0].MobilePersonal;
    this.SupplierCustomerData.CustomerAddress = data[0].Address1;
    return this.SupplierCustomerData;
  }
  public getBackGroundColor(index) {
    index = index + 1;
    let rowIndex = 1;
    let color = "";
    while (index > 3) {
      index = index % 3;
      rowIndex += 1;
    }
    if (rowIndex % 2 != 0) {
      switch (index) {
        case 1:
          color = "#8532a8";
          break;
        case 2:
          color = "#28a745";
          break;
        case 3:
          color = "#17a2b8";
          break;
      }
    } else if (rowIndex % 2 == 0) {
      switch (index) {
        case 3:
          color = "#8532a8";
          break;
        case 2:
          color = "#28a745";
          break;
        case 1:
          color = "#17a2b8";
          break;
      }
    }
    return color;
  }
  public FormatNumber(num) {
    let number;
    // if (num >= 0 && num != null) {
    if (num != null) {
      number = num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    } else {
      number = 0;
    }
    return number;
  }
  CardBackGroundClassList = ["card-color-bg-red", "card-color-bg-green", "card-color-bg-yellow", "card-color-bg-blue"];
  CardIconClassList = ["card-icon-color-red", "card-icon-color-green", "card-icon-color-yellow", "card-icon-color-blue"];
  public GetClassNameForCardBackground(index, classType: string) {
    let className = "";
    if (index > 4) {
      while (index > 4) {
        index = index - 4;
      }
    }
    className = this.ReturnBackroundClassName(index, classType);
    return className;
  }
  public ReturnBackroundClassName(index, type) {
    let ClassList = [];
    if (type == "ClassForBackground") {
      ClassList = this.CardBackGroundClassList;
    } else if (type == "ClassForIcon") {
      ClassList = this.CardIconClassList;
    }
    let className: string;
    switch (index) {
      case 1:
        className = ClassList[0];
        break;
      case 2:
        className = ClassList[1];
        break;
      case 3:
        className = ClassList[2];
        break;
      case 4:
        className = ClassList[3];
    }
    return className;
  }
  public CalculateTotalsByPropertyNames(data, PropertyNamesList: Array<string>, ListToBeReturned: Array<TotalsObjectToBeReturnedAfterTotalCalculation>) {
    if (PropertyNamesList.length != ListToBeReturned.length) throw new Error("Length Property Name List and List To Be Returned are not Equal");
    if (PropertyNamesList.length == ListToBeReturned.length) {
      ListToBeReturned.map((item) => (item.value = 0));
      data.map((item) => {
        for (let i = 0; i < PropertyNamesList.length; i++) {
          for (let j = 0; j < ListToBeReturned.length; j++) {
            if (ListToBeReturned[j].name == PropertyNamesList[i]) {
              ListToBeReturned[j].value += item[PropertyNamesList[i]];
            }
          }
        }
      });
    }
    return ListToBeReturned;
  }
  public SortArrayInAscendingOrder(data, SortyByPropertyName) {
    data.sort((objectReference1, objectReference2) => (objectReference1[SortyByPropertyName] > objectReference2[SortyByPropertyName] ? 1 : -1));
    return data;
  }
  HistoryGridShortcutKeys(ShortcutKeysList:Array<HistoryShortcutKeysHolderObject>)
  {
    console.log(ShortcutKeysList)
    ShortcutKeysList.map((item)=>{
          this.shortcutKeys
    .addShortcut({ keys: item.key })
    .pipe(take(item.ConsectiveNumberOfKeys))
    .subscribe((result) => {
      item.ActionToPerform()
    });
    })

  }
}
export class HistoryShortcutKeysHolderObject{
  key:string;
  FirstKey?:string;
  SecondKey?:string;
  Description?: string;
  ConsectiveNumberOfKeys:number;
  ActionToPerform: ()=>any;
}
export class CompanyInfo {
  CompanyId: number;
  FinancialYearId: number;
  CompanyName: number;
  CompanyAddress: number;
  CompanyEmail: string;
  CompanyPhoneNumber: string;
}
export class CustomerDataType {
  CustomerName: string;
  CustomerAddress: string;
  CustomerPhoneNumber: string;
  CustomerEmail: string;
}
export class InvoiceDataType {
  InvoiceId: number;
  InvoiceVoucherHeadId: number;
  InvoiceNumber: string;
  InvoiceDate: string;
  InvoicePaymentTerms: string;
  InvoiceDueDate: string;
  CustomerId: number;
  SupplierCustomerName: string;
  SupplierCustomerPhoneNumber: string;
  InvoiceBillAmount: number;
  InvoiceQty: number;
  InvoiceDiscount: number;
  InvoiceDetailList: Array<InvoiceDetailType>;
}
export class InvoiceDetailType {
  ItemName: string;
  ItemQty: number;
  ItemRate: number;
  ItemDiscount: number;
  ItemAmount: number;
}
export class TotalsObjectToBeReturnedAfterTotalCalculation {
  name: string;
  value: number;
}
