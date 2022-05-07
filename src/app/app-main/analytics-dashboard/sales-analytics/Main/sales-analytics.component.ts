import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { SalesAnalyticsModel } from "./sales-analytics.model";
import { SalesAnalyticsService } from "../sales-analytics.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { BaseActions } from "src/app/shared/Base/BaseActions";
@Component({
  selector: "app-sales-analytics",
  templateUrl: "./sales-analytics.component.html",
  styleUrls: ["./sales-analytics.component.scss"],
})
export class SalesAnalyticsComponent extends BaseActions implements OnInit {
  @ViewChild("SalesAnalyticsForm", { static: false })
  SalesAnalyticsForm: DxFormComponent;
  SalesAnalyticsFormData: SalesAnalyticsModel;
  dummyData = new Array<SalesAnalyticsModel>();
  AnalyticsReportListForSingleGroup = [];
  AnalyticsReportListForMultiGroup = [];
  singleGroupComparisonDataSource = [];
  multiGroupComparisonDataSource = [];
  multiGroupComparisonSecondGridDataSource = [];
  multiGroupHeaderArray = [];
  itemCategoryList = [];
  itemTypeList = [];
  JobLotList = [];
  CropYearList = [];
  ItemList = [];
  SupplierCustomerList = [];
  //===================Conditional Variables
  singleGroupComparisonReportVisible: boolean = false;
  multiGroupComparisonReport2Visible: boolean = false;
  multiGroupComparisonReportVisible: boolean = false;
  singleGroupComparisionReportHeading: string = "";
  multiGroupComparisionReportHeading: string = "";

  //=============================================
  FirstGroupCaption: string = "";
  SecondGroupCaption: string = "";
  TotalSale: number;
  TotalQty: number;
  TotalWeight: number;
  TotalAmount: number;

  constructor(private service: SalesAnalyticsService, private commonMethods: CommonMethodsForCombos) {
    super();
  }

  async ngOnInit() {
    this.itemCategoryList = await this.commonMethods.ItemCategoriesGetAll();
    this.itemTypeList = await this.commonMethods.ItemTypesGetAll();
    this.JobLotList = await this.commonMethods.getJobLot();
    this.CropYearList = await this.commonMethods.CropYear();
    this.ItemList = await this.commonMethods.ItemsFromInventoryStocksEvaluations();
    this.SupplierCustomerList = await this.commonMethods.SupplierCustomerFromInventoryStocksEvaluations();

    this.GetAnalyticsReportsListForSingleGroup();
    this.GetAnalyticsReportsListForMultiGroup();
    this.onInit();
  }

  onInit() {
    this.SalesAnalyticsFormData = new SalesAnalyticsModel();
    this.SalesAnalyticsFormData.ToDate = new Date();
    this.SalesAnalyticsFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
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
        Activity: "LocalSalesComaprisons",
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
        Activity: "LocalSalesComaprisonsByCustomerItem",
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
      .SalesComparisons({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ToDate: this.SalesAnalyticsFormData.ToDate,
        FromDate: this.SalesAnalyticsFormData.FromDate,
        ItemId: this.SalesAnalyticsFormData.ItemId,
        SupplierCustomerId: this.SalesAnalyticsFormData.SupplierCustomerId,
        ItemCategoryId: this.SalesAnalyticsFormData.ItemCategoryId,
        ItemTypeId: this.SalesAnalyticsFormData.ItemTypeId,
        JobLotId: this.SalesAnalyticsFormData.JobLotId,
        CropYear: this.SalesAnalyticsFormData.CropYear,
        ReportType: comparisonName,
      })
      .subscribe(
        (result) => {
          this.singleGroupComparisonDataSource = [];
          this.TotalSale = 0;
          this.FirstGroupCaption = result[0].GroupCaption;
          this.TotalSale = result[0].TotalAmount;
          this.singleGroupComparisonDataSource = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  GetExportMultiGroupComparisonByAcitvity(comparisonName) {
    this.service
      .SalesComparisonByCustomerAndItem({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ToDate: this.SalesAnalyticsFormData.ToDate,
        FromDate: this.SalesAnalyticsFormData.FromDate,
        ItemId: this.SalesAnalyticsFormData.ItemId,
        SupplierCustomerId: this.SalesAnalyticsFormData.SupplierCustomerId,
        ItemCategoryId: this.SalesAnalyticsFormData.ItemCategoryId,
        ItemTypeId: this.SalesAnalyticsFormData.ItemTypeId,
        JobLotId: this.SalesAnalyticsFormData.JobLotId,
        CropYear: this.SalesAnalyticsFormData.CropYear,
        ReportType: comparisonName,
      })
      .subscribe(
        (result) => {
          this.multiGroupHeaderArray = [];
          this.multiGroupComparisonDataSource = [];
          this.TotalQty = 0;
          this.TotalWeight = 0;
          this.TotalAmount = 0;
          if (result) {
            this.TotalQty = result[0].TotalQty;
            this.TotalWeight = result[0].TotalWeight;
            this.TotalAmount = result[0].TotalAmount;
            this.multiGroupComparisonDataSource = result;
            this.FirstGroupCaption = result[0].FirstGroupCaption;
            this.SecondGroupCaption = result[0].SecondGroupCaption;
            for (let i = 0; i < result.length; i++) {
              if (i == 0) {
                this.multiGroupHeaderArray.push({
                  FirstGroupName: result[i].FirstGroupName,
                  QtyBy1StGroup: result[i].QtyBy1StGroup,
                  WeightBy1StGroup: result[i].WeightBy1StGroup,
                  AmountBy1StGroup: result[i].AmountBy1StGroup,
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
                  this.multiGroupHeaderArray.push({
                    FirstGroupName: result[i].FirstGroupName,
                    QtyBy1StGroup: result[i].QtyBy1StGroup,
                    WeightBy1StGroup: result[i].WeightBy1StGroup,
                    AmountBy1StGroup: result[i].AmountBy1StGroup,
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
  SalesComparisonsPdf(data) {
    this.ActivateLoadPanel("Loading Report");
    this.service
      .SalesComparisonsPdf({
        //Compulosry
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ToDate: this.SalesAnalyticsFormData.ToDate,
        FromDate: this.SalesAnalyticsFormData.FromDate,
        ItemId: this.SalesAnalyticsFormData.ItemId,
        SupplierCustomerId: this.SalesAnalyticsFormData.SupplierCustomerId,
        ItemCategoryId: this.SalesAnalyticsFormData.ItemCategoryId,
        ItemTypeId: this.SalesAnalyticsFormData.ItemTypeId,
        JobLotId: this.SalesAnalyticsFormData.JobLotId,
        CropYear: this.SalesAnalyticsFormData.CropYear,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportType: data.ReportName,
        ReportName: "305-LocalSalesComaprisons_Report",
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
  // ExportComparisonByCustomerAndItemPdf1(data) {
  //   this.service
  //     .ExportComparisonByCustomerAndItemPdf({
  //       //Compulosry
  //       OrganizationId: sessionStorage.getItem("OrganizationId"),
  //       CompanyId: sessionStorage.getItem("CompanyId"),
  //       CompanyAddress: sessionStorage.getItem("CompanyAddress"),
  //       CompanyName: sessionStorage.getItem("CompanyName"),
  //       ToDate: this.SalesAnalyticsFormData.ToDate,
  //       ReportType: data.ReportName,
  //       ReportName: "534-ExportComparisonSummaryByCustomer&ItemReport",
  //     })
  //     .subscribe(
  //       (result) => window.open(result),
  //       (error) => {
  //         this.message = error.ExceptionMessage;
  //         this.errorPopupVisisble = true;
  //       }
  //     );
  // }
  SalesComparisonByCustomerAndItemPdf(data) {
    this.ActivateLoadPanel("Loading Report");
    this.service
      .SalesComparisonByCustomerAndItemPdf({
        //Compulosry

        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ToDate: this.SalesAnalyticsFormData.ToDate,
        FromDate: this.SalesAnalyticsFormData.FromDate,
        ItemId: this.SalesAnalyticsFormData.ItemId,
        SupplierCustomerId: this.SalesAnalyticsFormData.SupplierCustomerId,
        ItemCategoryId: this.SalesAnalyticsFormData.ItemCategoryId,
        ItemTypeId: this.SalesAnalyticsFormData.ItemTypeId,
        JobLotId: this.SalesAnalyticsFormData.JobLotId,
        CropYear: this.SalesAnalyticsFormData.CropYear,

        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportType: data.ReportName,
        ReportName: "306-LocalSalesComaprisonsByCustomerItem_Report",
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
