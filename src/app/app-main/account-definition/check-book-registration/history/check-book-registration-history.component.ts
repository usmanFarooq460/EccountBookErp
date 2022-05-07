import { Component, OnInit, Output, ViewChild } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CheckBookRegistrationService } from "../check-book-registration.service";

@Component({
  selector: "check-book-registration-history",
  templateUrl: "./check-book-registration-history.component.html",
  styleUrls: [],
})
export class CheckBookRegistrationHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("checkBookRegistration", { static: false })
  checkBookRegistration: DxDataGridComponent;
  dataSource = [];
  headerArray=[];
  constructor(private service: CheckBookRegistrationService) {
    super();  
    this.filter = true;
  }

  ngOnInit(): void {
    this.breadCrumb("WSRM", "Check Book Registration");
    this.getAllRecordsOfCheckBookRegistraions(1);
  }

  getAllRecordsOfCheckBookRegistraions(e) {
    this.ActivateLoadPanel("Loading History");
    this.service
      .GetCheqBookHeaderHistory({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (resp) => {
          this.DeActivateLoadPanel();
          this.dataSource = resp;
          this.headerArray=this.GenerateHeaderData(resp,"Id");
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }


  DummyMethod() {}
  onToolbarPreparing = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("checkBookRegistration"), this.checkBookRegistration));
    this.FilterButtonInGridToolbar(e);
  };
}
