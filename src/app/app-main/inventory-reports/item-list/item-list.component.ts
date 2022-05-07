import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { ItemLedgerService } from "./item-list.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { ItemListModel } from "./item-list.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-item-list",
  templateUrl: "./item-list.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class ItemListComponent extends BaseActions implements OnInit {
  @ViewChild("listItemGrid", { static: false })
  listItemGrid: DxDataGridComponent;

  @ViewChild("ItemListForm", { static: false })
  ItemListForm: DxFormComponent;
  ItemListFormData: ItemListModel;
  catagoryList = [];
  itemTypeList = [];
  itemClassList = [];
  purhcaseGlAcList = [];
  saleGlAcList = [];
  CgsGlAcList = [];
  dataSource = [];

  constructor(private router:Router,private service: ItemLedgerService, private commonService: CommonBaseService) {
    super();
  }


  async ngOnInit() {
    this.breadCrumb("Inventory Report", "Item List");
    this.PurchaseGlAc();
    this.ItemCatagoryFunc();
    this.ItemtypeFunc();
    this.ItemClassFunc();
    this.initForm();
  }
  public initForm() {
    this.ItemListFormData = new ItemListModel();
  }

  PurchaseGlAc() {
    this.service
      .itemAccountsGet({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.purhcaseGlAcList = result;
          this.saleGlAcList = result;
          this.CgsGlAcList = result;
        },
        (error) => {
          if (error.ExceptionMessage) {
            this.ErrorPopup(error.ExceptionMessage);
          } else if (error.Message) {
            this.ErrorPopup(error.Message);
          } else {
            this.ErrorPopup(error);
          }
        }
      );
  }
  ItemCatagoryFunc() {
    this.service
      .ItemCategoryGet({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.catagoryList = result;
        },
        (error) => {
          if (error.ExceptionMessage) {
            this.ErrorPopup(error.ExceptionMessage);
          } else if (error.Message) {
            this.ErrorPopup(error.Message);
          } else {
            this.ErrorPopup(error);
          }
        }
      );
  }
  ItemtypeFunc() {
    this.service
      .ItemTypeGet({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.itemTypeList = result;
        },
        (error) => {
          if (error.ExceptionMessage) {
            this.ErrorPopup(error.ExceptionMessage);
          } else if (error.Message) {
            this.ErrorPopup(error.Message);
          } else {
            this.ErrorPopup(error);
          }
        }
      );
  }
  ItemClassFunc() {
    this.service
      .ItemClassGet({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.itemClassList = result;
        },
        (error) => {
          if (error.ExceptionMessage) {
            this.ErrorPopup(error.ExceptionMessage);
          } else if (error.Message) {
            this.ErrorPopup(error.Message);
          } else {
            this.ErrorPopup(error);
          }
        }
      );
  }
  onSubmit() {
    const result: any = this.ItemListForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      // this.notification("Critarea Apply: Thank You", "success");
      this.popoverVisible = false;

      (this.ItemListFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"))),
        (this.ItemListFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"))),
        this.service.itemListhistory(this.ItemListFormData).subscribe(
          (result) => {
            this.dataSource = result;
          },
          (error) => {
            if (error.ExceptionMessage) {
              this.ErrorPopup(error.ExceptionMessage);
            } else if (error.Message) {
              this.ErrorPopup(error.Message);
            } else {
              this.ErrorPopup(error);
            }
          }
        );
    }
  }

  ReportRegister200() {
    if (this.ItemListFormData) {
      this.service
        .InvRptItemsList_200({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          ItemCategoryId: this.ItemListFormData.ItemCategoryId,
          ItemTypeId: this.ItemListFormData.ItemTypeId,
          ItemClassId: this.ItemListFormData.ItemClassId,
          PurchaseGLAC: this.ItemListFormData.PurchaseGLAC,
          SaleGLAC: this.ItemListFormData.SaleGLAC,
          COGSGLAC: this.ItemListFormData.COGSGLAC,
          ReportName: "200-InvRptItemsList",
        })
        .subscribe(
          (result) => window.open(result),
          (error) => {
            if (error.ExceptionMessage) {
              this.ErrorPopup(error.ExceptionMessage);
            } else if (error.Message) {
              this.ErrorPopup(error.Message);
            } else {
              this.ErrorPopup(error);
            }
          }
        );
    } else {
      this.ErrorPopup("Record Not Found")
    }
  }

  clear() {
    this.ItemListFormData = new ItemListModel();
  }

  goBack() {
    this.router.navigate(["/admin-panel/report-panel"]);
  }

  onToolPreparingOfItemHistoryGrid = (e) => {
    e.toolbarOptions.items.unshift(
      {
        location: "after",
        widget: "dxButton",
        options: {
          id: "outstandingPaddyPurchaseOrderChartButton",
          icon: "print",
          hint: "Print 200-Itemlist",
          onClick: this.ReportRegister200.bind(this),
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          id: "outstandingPaddyPurchaseOrderChartButton",
          icon: "back",
          hint: "Back",
          onClick: this.goBack.bind(this),
        },
      }
    );
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.onSubmit(),
      () => this.RefreshHistoryGridGrid(this.onSubmit.bind(this), this.HistoryGridSateKey("listItemGrid"), this.listItemGrid)
    );
  }
}
