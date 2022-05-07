import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { VarietyConversionService } from "../variety-conversion-service";

@Component({
  selector: "variety-conversion-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class VarietyConversionDetail implements OnInit {
  @Input() key: any;
  @Input() rowData: any;
  inputDataSource = [];
  outputDataSource = [];
  overheadDataSource = [];
  packingMaterialDataSource = [];
  accountHeadList = [];
  itemList = [];
  chargeToList = [
    { Id: 2, Label: "Recovery By Product" },
    { Id: 3, Label: "Recovery Head Rice" },
  ];
  loadPanelForDetailVisible: boolean;
  constructor(private commonService: CommonBaseService, private service: VarietyConversionService) {}

  ngOnInit(): void {
    this.loadPanelForDetailVisible = true;
    this.getCOAAllocation();
    this.getItem();
    this.GenerateDetailData();
  }

  GenerateDetailData() {
    this.service.getStockConversionById(this.rowData.Id).subscribe(
      (result: any) => {
        this.overheadDataSource = result.invStockConversionAddExpenses;
        this.packingMaterialDataSource = result.invStockConversionPackings;
        let detailRecord = result.invStockConversionDetails;
        this.inputDataSource = detailRecord.filter(({ EntryType }) => EntryType == "Issue");
        for (let i = 0; i < this.inputDataSource.length; i++) {
          this.inputDataSource[i].AmountWithoutExpenses = this.inputDataSource[i].Amount;
        }
        this.outputDataSource = detailRecord.filter(({ EntryType }) => EntryType != "Issue");

        for (let i = 0; i < this.outputDataSource.length; i++) {
          this.outputDataSource[i].AmountWithoutExpenses = this.outputDataSource[i].Amount - this.outputDataSource[i].PackingMaterialAmount - this.outputDataSource[i].ExpenseAmount;
        }
        this.loadPanelForDetailVisible = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getCOAAllocation() {
    this.service
      .getCOAAllocation({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => (this.accountHeadList = result),
        (error) => console.log(error)
      );
  }
  getItem() {
    this.service
      .getItem({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => (this.itemList = result),
        (error) => console.log(error)
      );
  }
}
