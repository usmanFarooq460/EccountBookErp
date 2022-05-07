import { Component, ViewChild, ElementRef, HostListener } from "@angular/core";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import notify from "devextreme/ui/notify";
import { GlobalConstant } from "src/app/Common/global-constant";
@Component({
  template: "",
})
export abstract class BaseActions {

  UserRightsObject = {
    canSave: false,
    canUpdate: false,
    View: false,
    Print: false,
    CanView_AllRecord: false,
  };
  DataGridFocusedRowHandlerObject = {
    FocusedRowIndex: 0,
    FocusedRowData: null,
  };
  MUST_PRINT_AFTER_SAVE: boolean = true;
  ChangePrintAfterSaveOption() {
    this.MUST_PRINT_AFTER_SAVE = !this.MUST_PRINT_AFTER_SAVE;
  }
  DecimalSettings: DecimalSettings;
  SetDecimalSettings() {
    console.log(GlobalConstant.DecimalSettings)
    this.DecimalSettings = {
      RatePercision: GlobalConstant.DecimalSettings.PercisionOfRate,
      AmountPercision: GlobalConstant.DecimalSettings.PercisionOfAmount,
      AmountFormatInGridTotals: GlobalConstant.DecimalSettings.AmountFormatInGridTotals,
      RateFormat:GlobalConstant.DecimalSettings.RateFormat,
      FcyRatePercision: GlobalConstant.DecimalSettings.PercisionOfFcyRate,
      FcyAmountPercision: GlobalConstant.DecimalSettings.PercisionOfFcyAmount,
      FcyRateFormat: GlobalConstant.DecimalSettings.FcyRateFormat,
      FcyAmountFormat: GlobalConstant.DecimalSettings.FcyAmountFormat,
      HcyRateFormatInPlainHtml: GlobalConstant.DecimalSettings.HcyRateFormatInPlainHtml,
      HcyAmountFormatInPlainHtml: GlobalConstant.DecimalSettings.HcyAmountFormatInPlainHtml,
      FcyRateFormatInPlainHtml: GlobalConstant.DecimalSettings.FcyRateFormatInPlainHtml,
      FcyAmountFormatInPlainHtml: GlobalConstant.DecimalSettings.FcyAmountFormatInPlainHtml
    };
    console.log(this.DecimalSettings)
  }
  confirmPopup: boolean = false;
  formPopup: boolean = false;
  filter: boolean;
  deleteIdValue: number;
  popoverVisible: boolean;
  editFormEntity;
  editEntity;
  deleteEntity;
  NoOfRecordsInGrid: number;
  EventInformationHolder: any;
  breadCrumbItems: Array<{}>;
  ExpandCollapseButtonActiveIcon: any = "unpin";
  DetailRowExpanded: boolean = false;
  warningPopupVisibility: boolean = false;
  errorPopupVisisble: boolean = false;
  successPopupVisible: boolean = false;
  loadPanelMessage: string = "";
  loadPanelVisible: boolean = false;
  message: string;
  IsHistoryGridLoadedInPopup: boolean = false;
  ButtonLoadIndicatorVisible: boolean = false;
  breadCrumb(parentLabel: string, childLabel: string) {
    return (this.breadCrumbItems = [{ label: parentLabel }, { label: childLabel, active: true }]);
  }
  //==================================@hamzamfaroqi55====================================
  // This Block of Code will handle Height and Width of PopupWithGrid
  HeightOfPopupWithGrid: number = window.innerHeight - (window.innerHeight * 10) / 100;
  WidthOfPopupWithGrid: number = window.innerWidth - (window.innerWidth * 10) / 100;
  WidthOfGridInPopupWithGrid: number = window.innerWidth - (window.innerWidth * 12) / 100;
  HeightOfGridInPopupWithGrid: number = window.innerHeight - (window.innerHeight * 20) / 100;
  //==================================@hamzamfarooqi55===================================
  // This Block Of Code will handle stickiness of History Grid ---> Only For History Grids before Form
  // Remember this block of code assumes that there is only title and a button in two different Rows above the Gid
  @ViewChild("stickyGrid") stickyGrid: ElementRef;
  sticky: boolean = false;
  gridPosition: any;
  @HostListener("window:scroll", ["$event"])
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= this.gridPosition && this.IsHistoryGridLoadedInPopup == false) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }
  gridColumnHeight: any = window.innerHeight - 110 + "px";
  gridColumnHeightInPopupWithGrid = ((window.innerHeight - (window.innerHeight * 10) / 100) * 72) / 100;
  gridHeightInPopupWithGrid = ((window.innerHeight - (window.innerHeight * 10) / 100) * 70) / 100;
  gridHeight: any = window.innerHeight - 130;
  //================================================SALE BILL RESPONSIVENESS
  //================================================SALE BILL RESPONSIVENESS
  heightValueOfInvoiceHistoryMainBox: number = window.innerHeight < 1060 ? 1040 : window.innerHeight - this.GetPercentageValue(10, window.innerHeight);
  heightOfInvoiceHistoryMainBox: string = this.heightValueOfInvoiceHistoryMainBox + "px";
  heightValueOfInvoiceHisotoryChildBox: number = this.heightValueOfInvoiceHistoryMainBox - this.GetPercentageValue(15, this.heightValueOfInvoiceHistoryMainBox) - 5;
  heightOfInvoiceHisotoryChildBox: string = this.heightValueOfInvoiceHisotoryChildBox + "px";
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    event.target.innerWidth;
    let height = event.target.innerHeight;
    let width = event.target.innerWidth;
    this.gridColumnHeight = height - (height * 15) / 100;
    this.gridHeight = height - (height * 18) / 100;
    this.HeightOfPopupWithGrid = height - (height * 10) / 100;
    this.WidthOfPopupWithGrid = width - (width * 10) / 100;
    this.HeightOfGridInPopupWithGrid = height - (height * 20) / 100;
    this.WidthOfGridInPopupWithGrid = width - (width * 12) / 100;
    this.gridColumnHeightInPopupWithGrid = ((height - (height * 10) / 100) * 72) / 100;
    this.gridHeightInPopupWithGrid = ((height - (height * 10) / 100) * 70) / 100;
    this.heightValueOfInvoiceHistoryMainBox = height < 1060 ? 1040 : height - this.GetPercentageValue(10, height);
    this.heightOfInvoiceHistoryMainBox = this.heightValueOfInvoiceHistoryMainBox + "px";
    this.heightValueOfInvoiceHisotoryChildBox = this.heightValueOfInvoiceHistoryMainBox - this.GetPercentageValue(15, this.heightValueOfInvoiceHistoryMainBox) - 5;
    this.heightOfInvoiceHisotoryChildBox = this.heightValueOfInvoiceHisotoryChildBox + "px";
  }
  DATETYPELIST = [
    { Id: 1, name: "Today" },
    { Id: 2, name: "Current Week" },
    { Id: 3, name: "Current Month" },
    { Id: 4, name: "Current Year" },
  ];
  GETMonday(d = new Date()) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }
  //=========================================================================================
  ngAfterViewInit() {
    if (this.stickyGrid) {
      this.gridPosition = this.stickyGrid.nativeElement.offsetTop;
    }
  }
  GetPercentageValue(percent, totalValue) {
    return (totalValue * percent) / 100;
  }
  //=======================================================================
  filtering() {
    this.filter = !this.filter;
  }
  notification(message: string, type: string) {
    return notify(message, type);
  }
  exportGrid(dataGrid) {
    const doc = new jsPDF();
    // const report_Name = "reportName";
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: dataGrid,
      autoTableOptions: {
        theme: "striped",
        headStyles: { textColor: "#fff", fontSize: 10, lineWidth: 0 },
        bodyStyles: { lineWidth: 0 },
        tableWidth: "auto",
        margin: { top: 22, right: 5, bottom: 10, left: 5 },
      },
    }).then(() => {
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        const header = sessionStorage.getItem("CompanyName");
        const address = sessionStorage.getItem("CompanyAddress");
        const footer = `Page ${i} of ${pageCount}`;
        const footerUrl = "www.eccountbook.com";
        const Support = "+92 3071020356";
        if (i === 1) {
          doc.setFont("times", "italic");
          doc.setFontSize(22);
          doc.text(header, 5, 5, { baseline: "top" });
          doc.setFontSize(10);
          doc.text(address, 5, 15, { baseline: "top" });
          doc.setFont("times", "");
          doc.setFontSize(15);
          // doc.text(report_Name, 5, 22, { baseline: "top" });
        }
        doc.setFontSize(10);
        doc.text(footerUrl, pageWidth / 10 - doc.getTextWidth(footer) / 2, pageHeight - 6, { baseline: "bottom" });
        doc.setFontSize(10);
        doc.text(footer, pageWidth / 2 - doc.getTextWidth(footer) / 2, pageHeight - 6, { baseline: "bottom" });
        // doc.setFontSize(10);
        // doc.text(Support, pageWidth / 12 - doc.getTextWidth(footer) / 2, pageHeight - 6, { baseline: "bottom" });
      }
      //doc.save("Report.pdf");
      doc.output("dataurlnewwindow");
    });
  }
  toolbarPreparing(event, dataGridInstanceRefresh, exportPdf, canPrintPdf = true) {
    event.toolbarOptions.items.unshift(
      {
        location: "after",
        widget: "dxButton",
        options: {
          icon: "refresh",
          hint: "Refresh",
          onClick: dataGridInstanceRefresh,
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          icon: "paste",
          hint: "Export Pdf",
          onClick: exportPdf,
        },
      }
    );
  }
  //=========================================================================================
  // This block of code will handle visiblity of Notification Popups(Warning , Error , Success)
  closeNotificationPopups(e) {
    this.warningPopupVisibility = false;
    this.errorPopupVisisble = false;
    this.successPopupVisible = false;
  }
  WarningPopup(msg) {
    this.warningPopupVisibility = true;
    this.message = msg;
  }
  ErrorPopup(msg) {
    this.errorPopupVisisble = true;
    this.message = msg;
  }
  SuccessPopup(msg) {
    this.successPopupVisible = true;
    this.message = msg;
  }
  //=========================================================================================
  // This block of code will return Key For HisotryGridSatae
  HistoryGridSateKey(gridName) {
    return sessionStorage.getItem("CompanyId") + sessionStorage.getItem("UserId") + gridName;
  }
  //=====================================Validate NumberBox
  validateNumberBox = (e) => {
    if (e.value > 0) {
      return true;
    } else if (e.vlaue > 0 == false) {
      return false;
    }
  };
  //=========================================================================================
  // This block of code will hanle Load Panel Visibility
  ActivateLoadPanel(msg) {
    this.loadPanelMessage = msg;
    this.loadPanelVisible = true;
  }
  DeActivateLoadPanel() {
    this.loadPanelVisible = false;
  }
  AcitvateButtonLoadIndicator() {
    this.ButtonLoadIndicatorVisible = true;
  }
  DeActivateButtonLoadIndicator() {
    this.ButtonLoadIndicatorVisible = false;
  }
  //==================================@hamzamfarooqi55========================================
  // This methods will reset the state of Grid
  // Also I have added an optional Parameter which accepts Function As Parameter
  // This is Function Parameter is to help to do anther task (if you have to ) along with reset of Grid.
  RefreshHistoryGridGrid(method: () => void, state, grid) {
    method();
    localStorage.removeItem(state);
    grid.instance.state(null);
    grid.instance.clearSorting();
    grid.instance.clearFilter();
    grid.instance.clearGrouping();
  }
  //=================================@UsmanFarooq
  //This block of code will return string containing Report Info
  GenereateReportInfoString(list: Array<ReportInfo>) {
    let infoString = "";
    for (let i = 0; i < list.length; i++) {
      if (list[i].ParameterValue != null && list[i].ParameterValue != undefined && list[i].ParameterValue != "") {
        infoString += list[i].ParameterName + " : " + list[i].ParameterValue + ", ";
      }
    }
    return infoString;
  }
  //===============================14 Jan 2022============================================
  FilterButtonInGridToolbar(event) {
    event.toolbarOptions.items.unshift({
      location: "after",
      widget: "dxButton",
      options: {
        id: "historyDetailReportFilterButton",
        icon: "filter",
        hint: "Filter Records",
        onClick: this.filtering.bind(this),
      },
    });
  }
  RefreshButtonInGridToolbar(event, GridRefresh) {
    event.toolbarOptions.items.unshift({
      location: "after",
      widget: "dxButton",
      options: {
        id: "historyDetailReportRefreshButton",
        icon: "refresh",
        hint: "Refresh Grid",
        onClick: GridRefresh,
      },
    });
  }
  ReportButtonInGridToolbar(event, ReportHint, ReportMehtod) {
    event.toolbarOptions.items.unshift({
      location: "after",
      widget: "dxButton",
      options: {
        id: "GridPrintButtonInToolbar",
        icon: "print",
        hint: ReportHint,
        onClick: ReportMehtod,
      },
    });
  }
  GridHeadingInToolbar(event, HeadingTemplate) {
    {
      event.toolbarOptions.items.unshift({
        location: "center",
        template: HeadingTemplate,
      });
    }
  }
  //==============================================@hamzamfarooqi55 (01 Jan 2022)
  HistoryGridToolBarPreparing(event, GridFilter, LoadAllRecords, GridRefresh) {
    event.toolbarOptions.items.unshift(
      {
        location: "after",
        widget: "dxButton",
        options: {
          id: "historyDetailReportFilterButton",
          icon: "filter",
          hint: "Filter Records",
          onClick: GridFilter,
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          id: "historyDetailReportLoadAllButton",
          icon: "download",
          hint: "Load All Records",
          onClick: LoadAllRecords,
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          id: "historyDetailReportRefreshButton",
          icon: "refresh",
          hint: "Refresh Grid",
          onClick: GridRefresh,
        },
      }
    );
  }
  LoaderGridToolBarPreparing(event, GridFilter, GridRefresh) {
    event.toolbarOptions.items.unshift(
      {
        location: "after",
        widget: "dxButton",
        options: {
          id: "historyDetailReportFilterButton",
          icon: "filter",
          hint: "Filter Records",
          onClick: GridFilter,
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          id: "historyDetailReportRefreshButton",
          icon: "refresh",
          hint: "Refresh Grid",
          onClick: GridRefresh,
        },
      }
    );
  }
  ExpanAllRows(dataGrid) {
    if (this.DetailRowExpanded == false) {
      this.ExpandCollapseButtonActiveIcon = "pin";
      this.DetailRowExpanded = true;
      dataGrid.instance.expandAll(-1);
    } else if (this.DetailRowExpanded == true) {
      this.ExpandCollapseButtonActiveIcon = "unpin";
      dataGrid.instance.collapseAll(-1);
      this.DetailRowExpanded = false;
    }
  }
  HistoryGridExpanAllRowButton(event, ExpandCollapseRow) {
    event.toolbarOptions.items.unshift({
      location: "after",
      widget: "dxButton",
      options: {
        id: "historyDetailReportFilterButton",
        icon: this.ExpandCollapseButtonActiveIcon,
        hint: "Expand All Rows",
        onClick: ExpandCollapseRow,
      },
    });
  }
  //This block of code will handle error in error block of service
  HandleError(error) {
    this.errorPopupVisisble = false;
    this.successPopupVisible = false;
    this.loadPanelVisible = false;
    let ErrorToBePrinted: string;
    if (error.ExceptionMessage) {
      ErrorToBePrinted = error.ExceptionMessage;
    } else if (error.Message) {
      ErrorToBePrinted = error.Message;
    } else {
      ErrorToBePrinted = error;
    }
    if (ErrorToBePrinted == "Error:") {
      ErrorToBePrinted = "Empty Erro Message was thrown by this API :" + GlobalConstant.LastApiCalled;
    }
    this.ErrorPopup(ErrorToBePrinted);
  }
  //================================================================14 Feb-2022 (@hamzamfarooqi55)
  async SetUserRightsInUserRightsObject(rightList) {
    if (rightList != null && rightList != undefined) {
      if (rightList.length > 0 == false) return;
      console.log(rightList);
      for (let { RightName, Value } of rightList) {
        if (RightName === "Update") {
          this.UserRightsObject.canUpdate = Value;
        }
        if (RightName === "Save") {
          this.UserRightsObject.canSave = Value;
        }
        if (RightName === "CanView AllRecord") {
          this.UserRightsObject.CanView_AllRecord = Value;
        }
        if (RightName === "Print") {
          this.UserRightsObject.Print = Value;
        }
      }
    }
  }
  //============================================================================
  //===============================================================18 Feb-2022 (@hamzamfarooqi55)
  GenerateHeaderData(data, BaseColumnName) {
    let headerArray = [];
    if (data != null && data != undefined) {
      for (let i = 0; i < data.length; i++) {
        if (i == 0) {
          headerArray.push(data[i]);
        } else if (i > 0) {
          let flag = false;
          for (let j = 0; j < headerArray.length; j++) {
            if (headerArray[j][BaseColumnName] == data[i][BaseColumnName]) {
              flag = true;
              break;
            }
          }
          if (flag == false) {
            headerArray.push(data[i]);
          }
        }
      }
    }
    return headerArray;
  }
  //===================================================================================
  OpenPdfReportInNewTab(path: string) {
    if (path != null && path != undefined && path != "") {
      window.open(path);
    }
  }
}
class ReportInfo {
  ParameterName: string;
  ParameterValue: any;
}
class DecimalSettings{
  RatePercision:number;
  AmountPercision: number;
  AmountFormatInGridTotals: string;
  RateFormat: string;
  FcyRatePercision: number;
  FcyAmountPercision: number;
  FcyRateFormat: string;
  FcyAmountFormat: string;
  HcyRateFormatInPlainHtml: string;
  HcyAmountFormatInPlainHtml: string;
  FcyRateFormatInPlainHtml: string;
  FcyAmountFormatInPlainHtml: string;
}