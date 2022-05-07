import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { ImportDashboardService } from "./import-dashboard.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { ImportDashboardModel } from "./import-dashboard.model";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { TwoDimentionalArrayBuilder } from "src/app/shared/Base/TwoDimentionalArrayBuilder";

@Component({
  selector: "export-dashboard",
  templateUrl: "./import-dashboard.component.html",
  styleUrls: ["./import-dashboard.component.scss"],
})
export class ImportDashboardComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild(DxDataGridComponent, { static: false })
  UnApprovedDeliveryOrderGrid: DxDataGridComponent;
  @ViewChild("ImportDashboardForm", { static: false })
  ImportDashboardForm: DxFormComponent;
  ImportDashboardFormData: ImportDashboardModel;
  filter: boolean = false;
  outstandingPopupFilter: boolean = false;
  dataSource = [];
  dateList = [
    { Id: 1, name: "Today" },
    { Id: 2, name: "Current Week" },
    { Id: 3, name: "Current Month" },
    { Id: 4, name: "Current Year" },
  ];
  outstandingcontractDataSource = [];
  //===================================================================
  DashboardDynamicObjectsList = [];
  ImportDashboardData = [];

  constructor(private service: ImportDashboardService, private router: Router, private commonService: CommonBaseService, private commonMethods: CommonMethodsForCombos) {
    super();
  }
  async ngOnInit() {
    this.breadCrumb("Dashboards", "Import Dashboard");
    this.ImportDashboardFormData = new ImportDashboardModel();
    this.ImportDashboardFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.ImportDashboardFormData.ToDate = new Date();
    this.onSubmit();
    await this.GenerateImportDashboard(await this.ReadImportDashboardData(), await this.commonMethods.DashboardDynamicObjects("ExectiveImportDashboard"));
  }
  showFirstToolTip() {}
  filtering() {
    this.filter = !this.filter;
  }
  filteringOutstandsingPopup() {
    this.outstandingPopupFilter = !this.outstandingPopupFilter;
  }
  setFocus = (e) => setTimeout(() => e.component.focus(), 0);
  //#region DateChange
  datetypeChanged = (e) => {
    if (e.value == 1) {
      this.ImportDashboardFormData.FromDate = new Date();
      this.ImportDashboardFormData.ToDate = new Date();
      this.onSubmit();
    }
    if (e.value == 2) {
      this.ImportDashboardFormData.FromDate = this.getMonday(new Date());
      this.ImportDashboardFormData.ToDate = new Date();
      this.onSubmit();
    }
    if (e.value == 3) {
      let my_date = new Date();
      let monthfirstdate = new Date(my_date.getFullYear(), my_date.getMonth(), 1);
      this.ImportDashboardFormData.FromDate = monthfirstdate;
      this.ImportDashboardFormData.ToDate = new Date();
      this.onSubmit();
    }
    if (e.value == 4) {
      var Year = new Date(new Date().getFullYear(), 0, 1);
      this.ImportDashboardFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
      this.ImportDashboardFormData.ToDate = new Date();
      this.onSubmit();
    }
  };
  getMonday(d = new Date()) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
    // console.log(new Date(d.setDate(diff)));
  }
  onSubmit() {}

  //#region   Forwarded But Bl Not Received
  filteringForwardedButPaymentNotReceivedPopup() {}
  closeForwardedButPaymentNotReceivedPopup() {}

  //#endregion

  //=======================================================================
  async ReadImportDashboardData() {
    return await this.service.ReadImportDashboardData({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
      FromDate: this.ImportDashboardFormData.FromDate,
      ToDate: this.ImportDashboardFormData.ToDate,
      ActivityId: 1,
    });
  }
  async GenerateImportDashboard(data, sortingList) {
    console.log(data);
    console.log(sortingList);
    let TwoDArrayBuilder = new TwoDimentionalArrayBuilder();
    let TwoDArray = TwoDArrayBuilder.GenerateTwoDimentionalArray(data, "MyDescription");
    let CustomTwoDArray = [];
    for (let i = 0; i < TwoDArray.length; i++) {
      CustomTwoDArray.push({ BaseColumnName: TwoDArray[i][0]["MyDescription"], List: TwoDArray[i] });
    }
    console.log(CustomTwoDArray);
    for (let i = 0; i < CustomTwoDArray.length; i++) {
      for (let j = 0; j < CustomTwoDArray[i].List.length; j++) {
        delete CustomTwoDArray[i].List[j]["MyDescription"];
        delete CustomTwoDArray[i].List[j]["Location_Name"];
      }
    }
    console.log(CustomTwoDArray);
    this.ImportDashboardData = CustomTwoDArray;
    this.DashboardDynamicObjectsList = sortingList;
  }
}
