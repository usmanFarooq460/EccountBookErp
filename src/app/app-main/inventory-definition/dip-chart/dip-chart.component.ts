import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { DipChartModel, DipChartHistoryModel } from "./dip-chart.model";
import { DipReadingService } from "./dip-chart.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { validate } from "src/app/shared/Base/validationHelper";
import notify from "devextreme/ui/notify";
@Component({
  selector: "app-dip-chart",
  templateUrl: "./dip-chart.component.html",
  styleUrls: [],
})
export class DipChartComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("DipChartForm", { static: false })
  DipChartForm: DxFormComponent;
  DipChartFormData: DipChartModel;
  DipChartHistoryForm: DxFormComponent;
  DipChartHistoryData: DipChartHistoryModel;
  optionsVisible: boolean;
  dataSource = [];
  itemList;
  uomList;
  lengthOfDataSource: any;
  itemList4History: [];
  tankList = [
    { Id: 1, name: "Tank 1" },
    { Id: 2, name: "Tank 2" },
    { Id: 3, name: "Tank 3" },
    { Id: 4, name: "Tank 4" },
  ];
  //UserRights
  canView: boolean;
  canSave: boolean;
  canPrint: boolean;
  canUpdate: boolean;
  //==============================================================================
  ApprovalPopupHeight: number = window.innerHeight - 400;
  ApprovalPopupWidth: number = window.innerWidth - 800;
  ApprovalPopupGridWidth: number = window.innerWidth - 200;

  ApprovalPopupGridHeight: number = window.innerHeight - 220;

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    event.target.innerWidth;
    let height = event.target.innerHeight;
    let width = event.target.innerWidth;
    this.ApprovalPopupHeight = height - (height * 50) / 100;
    this.ApprovalPopupWidth = width - (width * 50) / 100;
    this.ApprovalPopupGridWidth = width - (width * 23) / 100;
    this.ApprovalPopupGridHeight = height - (height * 27) / 100;
  }

  //==============================================================================
  DipChartParamsId: number = 0;
  constructor(private service: DipReadingService, private commonService: CommonBaseService) {
    super();
  }
  ngOnInit(): void {
    this.breadCrumb("Inventory Definition", "Dip Chart");
    this.optionsVisible = false;
    this.DipChartHistoryData = new DipChartHistoryModel();
    this.DipChartHistoryData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.DipChartHistoryData.ToDate = new Date();
    this.GetAllData();
    this.initForm();
  }
  public initForm() {
    this.DipChartFormData = new DipChartModel();

    this.DipChartFormData.DocDate = new Date();
    this.DipChartFormData.TankId = this.tankList[0].Id;
    this.GenereateDocCode();
    this.ItemsGetallFunc();
  }
  toggle() {
    this.optionsVisible = !this.optionsVisible;
  }
  setFocus = () => this.DipChartForm.instance.getEditor("TankId").focus();

  GetAllData() {
    this.service
      .DipChartHistory({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ItemId: this.DipChartHistoryData.ItemId,
        FromDate: this.DipChartHistoryData.FromDate,
        ToDate: this.DipChartHistoryData.ToDate,
      })
      .subscribe(
        (result) => {
          this.dataSource = result;
          this.lengthOfDataSource = [result.length];
        },
        (error) => {
          console.log(error);
        }
      );
  }

  GenereateDocCode() {
    this.service
      .GenerateCode({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.DipChartFormData.DocNo = result[0].DocNo;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  ItemsGetallFunc() {
    this.service
      .ItemGetAll({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.itemList = result;
          this.itemList4History = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  GetUomByItemId = (e) => {
    if (e.value) {
      this.UomsGetallFunc(e.value);
    }
  };
  UomsGetallFunc(id) {
    this.service
      .GetUom({
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
        ItemId: id,
      })
      .subscribe(
        (result) => {
          this.uomList = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  calculateDifference = (e) => {
    this.DipChartFormData.Difference = parseInt(this.DipChartForm.instance.getEditor("DipReadingStock").option("text")) - parseInt(this.DipChartForm.instance.getEditor("BooksStock").option("text"));
  };

  onSubmit() {
    if (validate(this.DipChartForm)) {
      if (this.DipChartParamsId > 0) {
        this.DipChartFormData.Id = this.DipChartParamsId;
      } else {
        this.DipChartFormData.Id = 0;
      }
      this.DipChartFormData.ModifyDate = new Date();
      this.DipChartFormData.EntryDate = new Date();
      this.DipChartFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.DipChartFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.DipChartFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.DipChartFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.service.Save(this.DipChartFormData).subscribe(
        (result) => {
          notify("Record Saved Successfully", "success");
          this.DipChartParamsId = null;
          this.DipChartForm.instance.resetValues();
          this.clear();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  onEdit = (e) => {
    this.DipChartParamsId = e.Id;
    this.service.DipChartGetById(this.DipChartParamsId).subscribe(
      (result) => {
        this.optionsVisible = true;
        this.DipChartFormData = result;
        this.notification("Record Get For Update", "warning");
        this.UomsGetallFunc(result.ItemId);
        this.CalculateDiffer();
      },
      (error) => console.log(error)
    );
  };
  CalculateDiffer() {
    this.DipChartFormData.Difference = this.DipChartFormData.DipReadingStock - this.DipChartFormData.BooksStock;
  }
  clear() {
    this.optionsVisible = !this.optionsVisible;
    this.DipChartForm.instance.resetValues();
    this.initForm();
    this.GetAllData();
  }
  InvDipReadingSlip296Slip(e) {
    this.service
      .InvDipReadingSlip296({
        Id: e.Id,
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "296-InvDipReadingSlip",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => console.log(error)
      );
  }
  onToolbarPreparing(event) {
    this.toolbarPreparing(
      event,
      () => this.dataGrid.instance.refresh(),
      () => this.exportGrid(this.dataGrid.instance)
    );
  }
}
