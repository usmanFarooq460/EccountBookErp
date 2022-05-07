import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";

@Component({
  selector: "app-accounts-budget-history",
  templateUrl: "./accounts-budget-history.component.html",
  styles: [],
})
export class AccountsBudgetHistoryComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  dataSource = [];
  column = [];

  constructor(private router: Router) {
    super();
  }

  ngOnInit(): void {}

  gotoForm() {
    this.router.navigate(["/accounts-definition/accounts-budget-form"]);
  }

  onEdit(e) {
    this.router.navigate(["/accounts-definition/accounts-budget-form"], {
      queryParams: { Id: e.Id },
    });
  }

  onToolbarPreparing(event) {
    this.toolbarPreparing(
      event,
      () => this.dataGrid.instance.refresh(),
      () => this.exportGrid(this.dataGrid.instance)
    );
  }
}
