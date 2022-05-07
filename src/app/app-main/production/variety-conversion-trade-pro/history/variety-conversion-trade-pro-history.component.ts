import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import notify from "devextreme/ui/notify";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { VarietyConversionTradeProService } from "../variety-conversion-trade-pro-service";
@Component({
  selector: "app-variety-conversion-history",
  templateUrl: "./variety-conversion-trade-pro-history.component.html",
  styleUrls: ["../detail/detail.component.scss"],
})
export class VarietyConversionTradeProHistoryComponent implements OnInit {
  dataSource = [];
  filter: boolean = false;
  @ViewChild("stickyMenu") menuElement: ElementRef;
  sticky: boolean = false;
  elementPosition: any;
  @HostListener("window:scroll", ["$event"])
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= this.elementPosition) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }
  //----------------------------------------
  columnHeight: any = window.innerHeight - 100 + "px";
  gridHeight: any = window.innerHeight - 120;
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    event.target.innerWidth;
    let height = event.target.innerHeight;

    this.columnHeight = height - (height * 12) / 100 + "px";
    this.gridHeight = height - (height * 15) / 100;
  }
  branchList: any;
  canPrint: boolean;
  canUpdate: boolean;
  constructor(private router: Router, private service: VarietyConversionTradeProService, private commonService: CommonBaseService) {}

  async ngOnInit() {
    this.branchList = await this.commonService.getBranch();
    this.userRights();
    this.getStockConversion();
  }
  ngAfterViewInit() {
    this.elementPosition = this.menuElement.nativeElement.offsetTop;
  }

  gotoStockConversionForm() {
    this.router.navigate(["/production/variety-conversion-trade-pro-form"]);
  }

  onEdit(e) {
    if (this.canUpdate) {
      this.router.navigate(["/production/variety-conversion-trade-pro-form"], {
        queryParams: { Id: e.Id },
      });
    } else {
      notify("You don't have right to Update!", "error");
    }
  }

  onSlipPrint(e) {
    if (this.canPrint) {
      this.service
        .ConversionByStockSlip_605({
          Id: e.Id,
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          BranchesId: this.branchList[0].Id,
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          ReportName: "605-RptInvStockConversion",
        })
        .subscribe(
          (result) => window.open(result),
          (error) => console.log(error)
        );
    } else {
      notify("You don't have right to Print", "error");
    }
  }
  userRights() {
    this.commonService
      .userRights({
        UserId: this.commonService.UserId(),
        ScreenName: "InvfrmPurchaseInvoice",
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

  getStockConversion() {
    this.service
      .getStockConversion({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        DocTypeId: 67,
      })
      .subscribe(
        (result) => {
          this.dataSource = result;
        },

        (error) => console.log(error)
      );
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
  onPrint(data) {}
  filtering() {
    this.filter = !this.filter;
  }
}
