import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { DefineItemService } from "../define-item.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { Router } from "@angular/router";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";


@Component({
  selector: "app-define-item-history",
  templateUrl: "./define-item-history.component.html",
  styleUrls: [],
})
export class DefineItemHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("defineInventoryItemHistoryGrid", { static: false })
  defineInventoryItemHistoryGrid: DxDataGridComponent;

  dataSource = [];
  @ViewChild("accountStatementForm", { static: false })
  accountStatementForm: DxFormComponent;
  accountStatementFormData: any;
  canUpdate: boolean;
  showItemForm = false;
  IdForUpdate: number;

  @Input() IsLoadedInPopup: boolean = false;
  @Input() SomeElementsVisible: boolean = true;

  constructor(private service: DefineItemService, private commonService: CommonBaseService, private router: Router) {
    super();
    this.filter = true;
  }

  ngOnInit(): void {
    this.breadCrumb("Item", "History");

    this.GetHistoryRecord();
  }



  GetHistoryRecord() {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .ItemGetAll({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.dataSource = result;
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }

  ShowForm() {
    this.showItemForm = !this.showItemForm;
    this.IdForUpdate = null;
  }

  CloseForm = (e) => {
    this.showItemForm = !this.showItemForm;
    this.IdForUpdate = null;
    this.GetHistoryRecord();
  };

  onEdit(e) {

      this.IdForUpdate = e.Id;
      this.showItemForm = true;
  }

  onToolPreparingOfHistoryGrid = (e) => {
    this.FilterButtonInGridToolbar(e);
    this.RefreshButtonInGridToolbar(e, () =>
      this.RefreshHistoryGridGrid(this.GetHistoryRecord.bind(this), this.HistoryGridSateKey("defineInventoryItemHistoryGrid"), this.defineInventoryItemHistoryGrid)
    );
  };
}
