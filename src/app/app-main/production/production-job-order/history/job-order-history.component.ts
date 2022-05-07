import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import notify from "devextreme/ui/notify";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { ProductionJobOrderService } from "../production-job-order.service";

@Component({
  selector: "app-job-order-history",
  templateUrl: "./job-order-history.component.html",
  styles: [],
})
export class ProductionJobOrderHistoryComponent implements OnInit {
  dataSource = [];
  filter: boolean = false;
  canPrint: boolean;
  canUpdate: boolean;
  constructor(private router: Router, private service: ProductionJobOrderService, private commonService: CommonBaseService) {}

  ngOnInit(): void {
    this.userRights();
    this.GetAllRecord();
  }

  gotoJobOrderForm() {
    this.router.navigate(["/production/production-job-order-form"]);
  }

  filtering() {
    this.filter = !this.filter;
  }
  onToolbarPreparing = (event) => {
    event.toolbarOptions.items.unshift({
      location: "after",

      widget: "dxButton",
      options: {
        id: "historyGridFilterButton",
        icon: "filter",
        hint: "Filter",
        onClick: this.filtering.bind(this),
      },
    });
  };
  onEdit(e) {
    if (this.canUpdate) {
      this.router.navigate(["/production/production-job-order-form"], {
        queryParams: { Id: e.Id },
      });
    } else {
      notify("You don't have right to Update", "error");
    }
  }

  GetAllRecord() {
    this.service
      .GetAll({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.dataSource = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  //#region
  userRights() {
    this.commonService
      .userRights({
        UserId: this.commonService.UserId(),
        ScreenName: "frmProductionJobOrder",
        RightName: this.commonService.RoleName(),
      })
      .subscribe(
        (result) => {
          for (let { RightName, Value } of result) {
            if (RightName === "Print") {
              this.canPrint = Value;
            }
            if (RightName === "Update") {
              this.canUpdate = Value;
            }
          }
        },
        (error) => console.log(error)
      );
  }
  //#endregion

  onSlipPrint(e) {
    if (this.canPrint) {
      this.service
        .ProductionJobOrderSlipA({
          Id: e.Id,
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          ReportName: "RptInvProductionJobOrderSlipA",
        })
        .subscribe(
          (result) => window.open(result),
          (error) => console.log(error)
        );
    } else {
      notify("You don't have right to print");
    }
  }
}
