import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { ExportAnalyticsModel } from "./export-analytics.model";
import { ExportAnalyticsService } from "../export-analytics.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { BaseActions } from "src/app/shared/Base/BaseActions";
@Component({
  selector: "app-export-analytics",
  templateUrl: "./export-analytics.component.html",
  styleUrls: ["./export-analytics.component.scss"],
})
export class ExportAnalyticsComponent extends BaseActions implements OnInit {
  @ViewChild("ExportAnalyticsForm", { static: false })
  ExportAnalyticsForm: DxFormComponent;
  ExportAnalyticsFormData: ExportAnalyticsModel;
  dummyData = new Array<ExportAnalyticsModel>();
  AnalyticsReportListForSingleGroup = [];
  AnalyticsReportListForMultiGroup = [];
  singleGroupComparisonDataSource = [];
  multiGroupComparisonDataSource = [];
  multiGroupComparisonSecondGridDataSource = [];
  multiGroupHeaderArray = [];
  itemCategoryList = [];
  itemTypeList = [];
  itemList = [];
  lcContractList = [];
  supplierCustomerList = [];
  seaPortList = [];
  //===================Conditional Variables
  singleGroupComparisonReportVisible: boolean = false;
  multiGroupComparisonReport2Visible: boolean = false;
  multiGroupComparisonReportVisible: boolean = false;
  singleGroupComparisionReportHeading: string = "";
  multiGroupComparisionReportHeading: string = "";

  //=============================================
  FirstGroupCaption: string = "";
  SecondGroupCaption: string = "";
  TotalExport: number;
  constructor(private service: ExportAnalyticsService, private commonMethods: CommonMethodsForCombos) {
    super();
  }

  async ngOnInit() {
    this.GetAnalyticsReportsListForSingleGroup();
    this.GetAnalyticsReportsListForMultiGroup();
    this.supplierCustomerList = await this.commonMethods.SupplierCustomerForExport();

    this.itemList = await this.commonMethods.GetItemsForExport();

    this.itemCategoryList = await this.commonMethods.ItemCategoriesGetAll();
    this.itemTypeList = await this.commonMethods.ItemTypesGetAll();
    this.lcContractList = await this.commonMethods.ExImGetLcOrderNo();
    this.seaPortList = await this.commonMethods.SeaPortsForExport();

    // this.Bank();
    this.onInit();
  }

  onInit() {
    this.ExportAnalyticsFormData = new ExportAnalyticsModel();
    this.ExportAnalyticsFormData.ToDate = new Date();
    this.ExportAnalyticsFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
  }

  showComparisonReport(data) {
    if (data.ReportType == 1) {
      this.singleGroupComparisonReportVisible = true;
      this.singleGroupComparisionReportHeading = data.ReportName;
      this.GetExportComparisionsByActivity(data.ReportName);
    } else if (data.ReportType == 2) {
      this.multiGroupComparisonReportVisible = true;
      this.multiGroupComparisionReportHeading = data.ReportName;
      this.GetExportMultiGroupComparisonByAcitvity(data.ReportName);
    }
  }
  closeReportPopup(e) {
    this.singleGroupComparisonReportVisible = false;
    this.multiGroupComparisonReportVisible = false;
    this.multiGroupComparisonReport2Visible = false;
  }

  GetAnalyticsReportsListForSingleGroup() {
    this.service
      .GetReportsList({
        Activity: "ExportComparisonsSummery",
      })
      .subscribe(
        (result) => {
          this.AnalyticsReportListForSingleGroup = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  GetAnalyticsReportsListForMultiGroup() {
    this.service
      .GetReportsList({
        Activity: "ExportComparisonsSummeryByCustomerItem",
      })
      .subscribe(
        (result) => {
          this.AnalyticsReportListForMultiGroup = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  GetExportComparisionsByActivity(comparisonName) {
    this.service
      .ExportComparisons({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ToDate: this.ExportAnalyticsFormData.ToDate,
        FromDate: this.ExportAnalyticsFormData.FromDate,
        ItemId: this.ExportAnalyticsFormData.ItemId,
        ItemTypeId: this.ExportAnalyticsFormData.ItemTypeId,
        ItemCategoryId: this.ExportAnalyticsFormData.ItemCategoryId,
        LcOrderId: this.ExportAnalyticsFormData.LcOrderId,
        DestinationPortId: this.ExportAnalyticsFormData.DestinationPortId,
        SupplierCustomerId: this.ExportAnalyticsFormData.SupplierCustomerId,
        ReportType: comparisonName,
      })
      .subscribe(
        (result) => {
          this.singleGroupComparisonDataSource = [];
          this.TotalExport = 0;
          this.FirstGroupCaption = result[0].GroupCaption;
          this.TotalExport = result[0].TotalMTons;
          this.singleGroupComparisonDataSource = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  GetExportMultiGroupComparisonByAcitvity(comparisonName) {
    this.service
      .ExportComparisonByCustomerAndItem({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ToDate: this.ExportAnalyticsFormData.ToDate,
        FromDate: this.ExportAnalyticsFormData.FromDate,
        ItemId: this.ExportAnalyticsFormData.ItemId,
        ItemTypeId: this.ExportAnalyticsFormData.ItemTypeId,
        ItemCategoryId: this.ExportAnalyticsFormData.ItemCategoryId,
        LcOrderId: this.ExportAnalyticsFormData.LcOrderId,
        DestinationPortId: this.ExportAnalyticsFormData.DestinationPortId,
        SupplierCustomerId: this.ExportAnalyticsFormData.SupplierCustomerId,
        ReportType: comparisonName,
      })
      .subscribe(
        (result) => {
          this.multiGroupComparisonDataSource = [];
          this.multiGroupHeaderArray = [];
          this.TotalExport = 0;
          this.multiGroupComparisonDataSource = result;
          if (result) {
            this.TotalExport = result[0].TotalMTons;
            this.FirstGroupCaption = result[0].FirstGroupCaption;
            this.SecondGroupCaption = result[0].SecondGroupCaption;

            for (let i = 0; i < result.length; i++) {
              let totalFcyAmountByFirstGroup = 0;
              let totalPkrAmountByFirstGroup = 0;
              if (i == 0) {
                for (let z = 0; z < result.length; z++) {
                  if (result[i].FirstGroupName == result[z].FirstGroupName) {
                    totalFcyAmountByFirstGroup += result[z].Fcy_Amount;
                    totalPkrAmountByFirstGroup += result[z].PKR_Amount;
                  }
                }

                this.multiGroupHeaderArray.push({
                  FirstGroupName: result[i].FirstGroupName,
                  TotalMtBy1stGroup: result[i].TotalMtBy1stGroup,
                  TotalFcyAmountByFirstGroup: totalFcyAmountByFirstGroup,
                  totalPkrAmountByFirstGroup: totalPkrAmountByFirstGroup,
                  PrcntBy1stGroup: result[i].PrcntBy1stGroup,
                });
              } else if (i > 0) {
                let flag = false;
                for (let j = 0; j < this.multiGroupHeaderArray.length; j++) {
                  if (this.multiGroupHeaderArray[j].FirstGroupName == result[i].FirstGroupName) {
                    flag = true;
                    break;
                  }
                }
                if (flag == false) {
                  for (let z = 0; z < result.length; z++) {
                    if (result[i].FirstGroupName == result[z].FirstGroupName) {
                      totalFcyAmountByFirstGroup += result[z].Fcy_Amount;
                      totalPkrAmountByFirstGroup += result[z].PKR_Amount;
                    }
                  }

                  this.multiGroupHeaderArray.push({
                    FirstGroupName: result[i].FirstGroupName,
                    TotalMtBy1stGroup: result[i].TotalMtBy1stGroup,
                    TotalFcyAmountByFirstGroup: totalFcyAmountByFirstGroup,
                    totalPkrAmountByFirstGroup: totalPkrAmountByFirstGroup,
                    PrcntBy1stGroup: result[i].PrcntBy1stGroup,
                  });
                }
              }
            }
          }
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  GenerateMainDetailData(data) {
    let dummyArray = [];
    for (let i = 0; i < data.length; i++) {
      if (i == 0) {
        dummyArray.push({
          AvgPrice: data[i].AvgPrice,
          FcrAvgRate: data[i].FcrAvgRate,
          FcyCode: data[i].FcyCode,
          Fcy_Amount: data[i].Fcy_Amount,
          FirstGroupCaption: data[i].FirstGroupCaption,
          FirstGroupName: data[i].FirstGroupName,
          MTons: data[i].MTons,
          PKR_Amount: data[i].PKR_Amount,
          PrcntBy1stGroup: data[i].PrcntBy1stGroup,
          PrctExport: data[i].PrctExport,
          SecondGroupCaption: data[i].SecondGroupCaption,
          SecondGroupName: data[i].SecondGroupName,
          TotalMTons: data[i].TotalMTons,
          TotalMtBy1stGroup: data[i].TotalMtBy1stGroup,
          RowType: "Main",
        });
        for (let j = 0; j < data.length; j++) {
          if (data[i].FirstGroupName == data[j].FirstGroupName) {
            dummyArray.push({
              AvgPrice: data[j].AvgPrice,
              FcrAvgRate: data[j].FcrAvgRate,
              FcyCode: data[j].FcyCode,
              Fcy_Amount: data[j].Fcy_Amount,
              FirstGroupCaption: data[j].FirstGroupCaption,
              FirstGroupName: data[j].FirstGroupName,
              MTons: data[j].MTons,
              PKR_Amount: data[j].PKR_Amount,
              PrcntBy1stGroup: data[j].PrcntBy1stGroup,
              PrctExport: data[j].PrctExport,
              SecondGroupCaption: data[j].SecondGroupCaption,
              SecondGroupName: data[j].SecondGroupName,
              TotalMTons: data[j].TotalMTons,
              TotalMtBy1stGroup: data[j].TotalMtBy1stGroup,
              RowType: "Detail",
            });
          }
        }
      } else if (i > 0) {
        let flag = false;
        for (let j = 0; j < dummyArray.length; j++) {
          if (dummyArray[j].FirstGroupName == data[i].FirstGroupName) {
            flag = true;
            break;
          }
        }
        if (flag == false) {
          dummyArray.push({
            AvgPrice: data[i].AvgPrice,
            FcrAvgRate: data[i].FcrAvgRate,
            FcyCode: data[i].FcyCode,
            Fcy_Amount: data[i].Fcy_Amount,
            FirstGroupCaption: data[i].FirstGroupCaption,
            FirstGroupName: data[i].FirstGroupName,
            MTons: data[i].MTons,
            PKR_Amount: data[i].PKR_Amount,
            PrcntBy1stGroup: data[i].PrcntBy1stGroup,
            PrctExport: data[i].PrctExport,
            SecondGroupCaption: data[i].SecondGroupCaption,
            SecondGroupName: data[i].SecondGroupName,
            TotalMTons: data[i].TotalMTons,
            TotalMtBy1stGroup: data[i].TotalMtBy1stGroup,
            RowType: "Main",
          });
          for (let j = 0; j < data.length; j++) {
            if (data[i].FirstGroupName == data[j].FirstGroupName) {
              dummyArray.push({
                AvgPrice: data[j].AvgPrice,
                FcrAvgRate: data[j].FcrAvgRate,
                FcyCode: data[j].FcyCode,
                Fcy_Amount: data[j].Fcy_Amount,
                FirstGroupCaption: data[j].FirstGroupCaption,
                FirstGroupName: data[j].FirstGroupName,
                MTons: data[j].MTons,
                PKR_Amount: data[j].PKR_Amount,
                PrcntBy1stGroup: data[j].PrcntBy1stGroup,
                PrctExport: data[j].PrctExport,
                SecondGroupCaption: data[j].SecondGroupCaption,
                SecondGroupName: data[j].SecondGroupName,
                TotalMTons: data[j].TotalMTons,
                TotalMtBy1stGroup: data[j].TotalMtBy1stGroup,
                RowType: "Detail",
              });
            }
          }
        }
      }
    }

    return dummyArray;
  }

  ExportComparisonsPdf(data) {
    this.ActivateLoadPanel("Loading Report");
    this.service
      .ExportComparisonsPdf({
        //Compulosry
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ToDate: this.ExportAnalyticsFormData.ToDate,
        FromDate: this.ExportAnalyticsFormData.FromDate,
        ItemId: this.ExportAnalyticsFormData.ItemId,
        ItemTypeId: this.ExportAnalyticsFormData.ItemTypeId,
        ItemCategoryId: this.ExportAnalyticsFormData.ItemCategoryId,
        LcOrderId: this.ExportAnalyticsFormData.LcOrderId,
        DestinationPortId: this.ExportAnalyticsFormData.DestinationPortId,
        SupplierCustomerId: this.ExportAnalyticsFormData.SupplierCustomerId,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportType: data.ReportName,
        ReportName: "536-ExportCustomerWiseComparisonReport",
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

  ExportComparisonByCustomerAndItemPdf1(data) {
    this.ActivateLoadPanel("Loading Report");
    this.service
      .ExportComparisonByCustomerAndItemPdf({
        //Compulosry
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ToDate: this.ExportAnalyticsFormData.ToDate,
        FromDate: this.ExportAnalyticsFormData.FromDate,
        ItemId: this.ExportAnalyticsFormData.ItemId,
        ItemTypeId: this.ExportAnalyticsFormData.ItemTypeId,
        ItemCategoryId: this.ExportAnalyticsFormData.ItemCategoryId,
        LcOrderId: this.ExportAnalyticsFormData.LcOrderId,
        DestinationPortId: this.ExportAnalyticsFormData.DestinationPortId,
        SupplierCustomerId: this.ExportAnalyticsFormData.SupplierCustomerId,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportType: data.ReportName,
        ReportName: "534-ExportComparisonSummaryByCustomer&ItemReport",
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel;
          window.open(result);
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }

  ExportComparisonByCustomerAndItemPdf2(data) {
    this.ActivateLoadPanel("Loading Report");
    this.service
      .ExportComparisonByCustomerAndItemPdf({
        //Compulosry
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ToDate: this.ExportAnalyticsFormData.ToDate,
        FromDate: this.ExportAnalyticsFormData.FromDate,
        ItemId: this.ExportAnalyticsFormData.ItemId,
        SupplierCustomerId: this.ExportAnalyticsFormData.SupplierCustomerId,
        ItemTypeId: this.ExportAnalyticsFormData.ItemTypeId,
        ItemCategoryId: this.ExportAnalyticsFormData.ItemCategoryId,
        LcOrderId: this.ExportAnalyticsFormData.LcOrderId,
        DestinationPortId: this.ExportAnalyticsFormData.DestinationPortId,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportType: data.ReportName,
        ReportName: "535-ExportComparisonSummaryByCustomer&ItemReport",
      })
      .subscribe(
        (result) => {
          window.open(result);
          this.DeActivateLoadPanel();
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }
}
