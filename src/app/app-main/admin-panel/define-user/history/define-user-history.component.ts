import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { DefineUserService } from "../define-user.service";
import { DxDataGridComponent } from "devextreme-angular";
@Component({
  selector: "app-define-user-history",
  templateUrl: "./define-user-history.component.html",
  styleUrls: ["./define-user-history.component.scss"],
})
export class DefineUserHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("dataGrid", { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("DefineUserFormComponent")
  DefineUserFormComponent;
  dataSource = [];
  DefineUserFormVisible: boolean = false;
  ParamsId: number = 0;
  constructor(private router: Router, private service: DefineUserService) {
    super();
  }

  ngOnInit(): void {
    this.History();
  }
  gotoForm() {
    this.handleDefineUserPopup(1);
  }
  onEdit(e) {
    this.ParamsId = e.ID;
    this.handleDefineUserPopup(1);
  }
  History() {
    this.service
      .History({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.dataSource = result;
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  handleDefineUserPopup(e) {
    this.DefineUserFormVisible = !this.DefineUserFormVisible;
    if (this.DefineUserFormVisible == true) {
      this.DefineUserFormComponent.GetData();
    }
  }
  DefineUserHistoryDataGridTollobarPreparing = (e) => {
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.History(),
      () => this.RefreshHistoryGridGrid(this.History.bind(this), this.HistoryGridSateKey("DefineUserHistoryGrid"), this.dataGrid)
    );
    this.HistoryGridExpanAllRowButton(e, () => this.ExpanAllRows(this.dataGrid));
  };
}
