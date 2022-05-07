import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { DefineCompanyService } from "../define-company.service";
import { DxDataGridComponent } from "devextreme-angular";
@Component({
  selector: "app-define-company-history",
  templateUrl: "./define-company-history.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class DefineCompanyHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("dataGrid", { static: false })
  dataGrid: DxDataGridComponent;
  dataSource = [];
  constructor(private router: Router, private service: DefineCompanyService) {
    super();
  }

  ngOnInit(): void {
    this.History();
  }
  gotoForm() {
    this.router.navigate(["/admin-panel/define-company-form"]);
  }
  onEdit(e) {
    this.router.navigate(["/admin-panel/define-company-form"], {
      queryParams: { Id: e.Id },
    });
  }
  History() {
    this.service.History({ OrgCompanyTypeId: sessionStorage.getItem("OrganizationId") }).subscribe(
      (result) => {
        this.dataSource = result;
        console.log(result);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  DefineCompanyHistoryDataGridTollobarPreparing = (e) => {
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.History(),
      () => this.RefreshHistoryGridGrid(this.History.bind(this), this.HistoryGridSateKey("WsrmTransferOrderHistoryGrid"), this.dataGrid)
    );
    this.HistoryGridExpanAllRowButton(e, () => this.ExpanAllRows(this.dataGrid));
  };
}
