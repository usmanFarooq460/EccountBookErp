import { Component, OnInit, ViewChild, Output, EventEmitter, HostListener, Input } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { InventoryDashboardService } from "../inventory-dashboard.service";
import { Model } from "../inventory-dashboard-grids.model";
import { bounceInDownOnEnterAnimation, bounceInUpOnEnterAnimation, rotateInOnEnterAnimation, bounceInLeftOnEnterAnimation, bounceInRightOnEnterAnimation } from "angular-animations";
@Component({
  selector: "inventory-dasboard-grids",
  templateUrl: "./inventory-dasboard-grids.component.html",
  styleUrls: ["./inventory-dasboard-grids.component.scss"],
  animations: [
    bounceInDownOnEnterAnimation({ anchor: "bounceInDown", duration: 4000, delay: 500 }),
    bounceInUpOnEnterAnimation({ anchor: "bounceInUp", duration: 4000, delay: 500 }),
    bounceInLeftOnEnterAnimation({ anchor: "bounceInLeft", duration: 4000, delay: 500 }),
    bounceInRightOnEnterAnimation({ anchor: "bounceInRight", duration: 4000, delay: 500 }),
  ],
})
export class InventoryDasboardGridsComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  dataSource = [];
  dataSourceCount: number;
  DataSourceForGrids = [];
  DataSourceForOrdersByParentCategoryCards = [];
  filter: boolean = false;

  ApprovalPopupHeight: number = window.innerHeight - 150;
  ApprovalPopupWidth: number = window.innerWidth - 150;
  ApprovalPopupGridWidth: number = window.innerWidth - 200;
  ApprovalPopupGridHeight: number = window.innerHeight - 220;
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    event.target.innerWidth;
    let height = event.target.innerHeight;
    let width = event.target.innerWidth;
    this.ApprovalPopupHeight = height - (height * 20) / 100;
    this.ApprovalPopupWidth = width - (width * 20) / 100;
    this.ApprovalPopupGridWidth = width - (width * 23) / 100;
    this.ApprovalPopupGridHeight = height - (height * 27) / 100;
  }

  @Output() dataForDetailReport = new EventEmitter();
  @Output() popupVisiblity = new EventEmitter();
  @Input() detailDataSourceForOrdersByParentCategory: any;
  @Input() popupVisible: boolean;
  animationState: string = "state0";
  mainCardVisisble: boolean = false;
  mainCardTitleVisible: boolean = false;
  constructor(private service: InventoryDashboardService) {}

  ngOnInit(): void {
    this.OrdersByParentCategories();
    // this.BOMB(this.dataArray);
  }
  OrdersByParentCategories() {
    this.service
      .OrdersByParentCategories({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FromDate: new Date(sessionStorage.getItem("StartPeriod")),
        ToDate: new Date(),
      })
      .subscribe(
        (result) => {
          this.dataSource = result;

          this.BOMB(this.dataSource);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  BOMB(data) {
    //Replace 'FilterObjectFor1' with 'OrderDescription';
    //Replace 'FilterObjectFor2' with Id;
    let originalDataSource = [];
    let countForDifferectFilterObject1: number = 0;
    let countForDifferentFilterObject2: number = 0;
    let listForCountingFilterObject1 = [];
    for (let i = 0; i < data.length; i++) {
      if (i == 0) {
        listForCountingFilterObject1.push({
          OrderDescription: data[i].OrderDescription,
        });
        countForDifferectFilterObject1 += 1;
      } else if (i > 0) {
        let flag = false;
        for (let j = 0; j < listForCountingFilterObject1.length; j++) {
          if (listForCountingFilterObject1[j].OrderDescription == data[i].OrderDescription) {
            flag = true;
          }
        }
        if (flag == false) {
          listForCountingFilterObject1.push({
            OrderDescription: data[i].OrderDescription,
          });
          countForDifferectFilterObject1 += 1;
        }
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (i == 0) {
        listForCountingFilterObject1.push({
          Id: data[i].Id,
        });
        countForDifferentFilterObject2 += 1;
      } else if (i > 0) {
        let flag = false;
        for (let j = 0; j < listForCountingFilterObject1.length; j++) {
          if (listForCountingFilterObject1[j].Id == data[i].Id) {
            flag = true;
          }
        }
        if (flag == false) {
          listForCountingFilterObject1.push({
            Id: data[i].Id,
          });
          countForDifferentFilterObject2 += 1;
        }
      }
    }

    for (let i = 0; i < countForDifferectFilterObject1; i++) {
      if (i == 0) {
        originalDataSource[i] = new Array<Model>();
        for (let j = 0; j < countForDifferentFilterObject2; j++) {
          if (j == 0) {
            originalDataSource[i][j] = new Array<Model>();
            for (let h = 0; h < data.length; h++) {
              if (h == 0) {
                originalDataSource[i][j].push({
                  OrderDescriptionId: data[h].OrderDescriptionId,
                  OrderDescription: data[h].OrderDescription,
                  OrderCategory: data[h].OrderCategory,
                  Id: data[h].Id,
                  CropYear: data[h].CropYear,
                  Qty: data[h].Qty,
                  NetWeight: data[h].NetWeight,
                });
              } else if (h > 0) {
                if (originalDataSource[i][j][0].OrderDescription == data[h].OrderDescription && originalDataSource[i][j][0].Id == data[h].Id) {
                  originalDataSource[i][j].push({
                    OrderDescriptionId: data[h].OrderDescriptionId,
                    OrderDescription: data[h].OrderDescription,
                    OrderCategory: data[h].OrderCategory,
                    Id: data[h].Id,
                    CropYear: data[h].CropYear,
                    Qty: data[h].Qty,
                    NetWeight: data[h].NetWeight,
                  });
                }
              }
            }
          } else if (j > 0) {
            let lengthAtJ = originalDataSource[i].length;

            let checkIfNewArrayIsToBeInitializedAtJ = false;
            for (let h = 0; h < data.length; h++) {
              let flagForDescription = false;
              let flagForCategory = false;
              for (let v = 0; v < originalDataSource[i].length; v++) {
                if (originalDataSource[i][v][0].OrderDescription == data[h].OrderDescription) {
                  flagForDescription = true;
                  if (originalDataSource[i][v][0].Id == data[h].Id) {
                    flagForCategory = true;
                  }
                }
              }
              if (flagForDescription == true && flagForCategory == false) {
                checkIfNewArrayIsToBeInitializedAtJ = true;
                originalDataSource[i][j] = new Array<Model>();
                break;
              }
            }

            if (checkIfNewArrayIsToBeInitializedAtJ == true) {
              for (let h = 0; h < data.length; h++) {
                let flag1 = false;
                let flag2 = false;

                for (let t = 0; t < lengthAtJ; t++) {
                  if (originalDataSource[i][t][0].OrderDescription == data[h].OrderDescription) {
                    flag1 = true;
                    if (originalDataSource[i][t][0].Id == data[h].Id) {
                      flag2 = true;
                    }
                  }
                }
                if (originalDataSource[i][j].length > 0 == false) {
                  if (flag1 == true && flag2 == false) {
                    originalDataSource[i][j].push({
                      OrderDescriptionId: data[h].OrderDescriptionId,
                      OrderDescription: data[h].OrderDescription,
                      OrderCategory: data[h].OrderCategory,
                      Id: data[h].Id,
                      CropYear: data[h].CropYear,
                      Qty: data[h].Qty,
                      NetWeight: data[h].NetWeight,
                    });
                  }
                } else if (originalDataSource[i][j].length > 0) {
                  if (originalDataSource[i][j][0].OrderDescription == data[h].OrderDescription && originalDataSource[i][j][0].Id == data[h].Id) {
                    originalDataSource[i][j].push({
                      OrderDescriptionId: data[h].OrderDescriptionId,
                      OrderDescription: data[h].OrderDescription,
                      OrderCategory: data[h].OrderCategory,
                      Id: data[h].Id,
                      CropYear: data[h].CropYear,
                      Qty: data[h].Qty,
                      NetWeight: data[h].NetWeight,
                    });
                  }
                }
              }
            }
          }
        }
      } else if (i > 0) {
        let lengthAtI = originalDataSource.length;
        originalDataSource[i] = new Array<Model>();
        for (let j = 0; j < countForDifferentFilterObject2; j++) {
          if (j == 0) {
            originalDataSource[i][j] = new Array<Model>();
            for (let h = 0; h < data.length; h++) {
              let flag3 = false;
              for (let k = 0; k < lengthAtI; k++) {
                if (originalDataSource[k][0][0].OrderDescription == data[h].OrderDescription) {
                  flag3 = true;
                }
              }
              if (originalDataSource[i][j].length > 0 == false) {
                if (flag3 == false) {
                  originalDataSource[i][j].push({
                    OrderDescriptionId: data[h].OrderDescriptionId,
                    OrderDescription: data[h].OrderDescription,
                    OrderCategory: data[h].OrderCategory,
                    Id: data[h].Id,
                    CropYear: data[h].CropYear,
                    Qty: data[h].Qty,
                    NetWeight: data[h].NetWeight,
                  });
                }
              } else if (originalDataSource[i][j].length > 0) {
                if (originalDataSource[i][j][0].OrderDescription == data[h].OrderDescription && originalDataSource[i][j][0].Id == data[h].Id) {
                  originalDataSource[i][j].push({
                    OrderDescriptionId: data[h].OrderDescriptionId,
                    OrderDescription: data[h].OrderDescription,
                    OrderCategory: data[h].OrderCategory,
                    Id: data[h].Id,
                    CropYear: data[h].CropYear,
                    Qty: data[h].Qty,
                    NetWeight: data[h].NetWeight,
                  });
                }
              }
            }
          } else if (j > 0) {
            let lengthATJ = originalDataSource[i].length;
            let checkIfNewArrayIsToBeInitializedAtJ = false;
            for (let h = 0; h < data.length; h++) {
              let flagForDescription = false;
              let flagForCategory = false;
              for (let v = 0; v < originalDataSource[i].length; v++) {
                if (originalDataSource[i][v][0].OrderDescription == data[h].OrderDescription) {
                  flagForDescription = true;
                  if (originalDataSource[i][v][0].Id == data[h].Id) {
                    flagForCategory = true;
                  }
                }
              }
              if (flagForDescription == true && flagForCategory == false) {
                checkIfNewArrayIsToBeInitializedAtJ = true;
                originalDataSource[i][j] = new Array<Model>();
                break;
              }
            }

            if (checkIfNewArrayIsToBeInitializedAtJ == true) {
              for (let h = 0; h < data.length; h++) {
                let flag4 = false;
                let flag5 = false;
                for (let r = 0; r < lengthATJ; r++) {
                  if (originalDataSource[i][r][0].OrderDescription == data[h].OrderDescription) {
                    flag4 = true;
                    if (originalDataSource[i][r][0].Id == data[h].Id) {
                      flag5 = true;
                    }
                  }
                }
                if (originalDataSource[i][j].length > 0 == false) {
                  if (flag4 == true && flag5 == false) {
                    originalDataSource[i][j].push({
                      OrderDescriptionId: data[h].OrderDescriptionId,
                      OrderDescription: data[h].OrderDescription,
                      OrderCategory: data[h].OrderCategory,
                      Id: data[h].Id,
                      CropYear: data[h].CropYear,
                      Qty: data[h].Qty,
                      NetWeight: data[h].NetWeight,
                    });
                  }
                } else if (originalDataSource[i][j].length > 0) {
                  if (originalDataSource[i][j][0].OrderDescription == data[h].OrderDescription && originalDataSource[i][j][0].Id == data[h].Id) {
                    originalDataSource[i][j].push({
                      OrderDescriptionId: data[h].OrderDescriptionId,
                      OrderDescription: data[h].OrderDescription,
                      OrderCategory: data[h].OrderCategory,
                      Id: data[h].Id,
                      CropYear: data[h].CropYear,
                      Qty: data[h].Qty,
                      NetWeight: data[h].NetWeight,
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
    this.DataSourceForOrdersByParentCategoryCards = originalDataSource;
    console.log(this.DataSourceForOrdersByParentCategoryCards)
    this.animationState = "state1";
    this.mainCardTitleVisible = true;
  }

  getClass(description, category) {
    if (description % 2 == 0) {
      if (category % 2 != 0) {
        return "dataGridCardHeaderId1";
      } else {
        return "dataGridCardHeaderId2";
      }
    } else {
      if (category % 2 != 0) {
        return "dataGridCardHeaderId3";
      } else {
        return "dataGridCardHeaderId4";
      }
    }
  }
  getId(description, category) {
    if (description % 2 == 0) {
      if (category % 2 != 0) {
        return "dataGrid1";
      } else {
        return "dataGrid2";
      }
    } else {
      if (category % 2 != 0) {
        return "dataGrid3";
      } else {
        return "dataGrid4";
      }
    }
  }
  OpenDetailReport(e) {
    this.dataForDetailReport.emit(e);
  }
  ClosePopup() {
    this.popupVisiblity.emit(1);
  }
  filtering() {
    this.filter = !this.filter;
  }
  getBounceInDownVisisbility(description, category) {
    if (description % 2 != 0) {
      if (category % 2 != 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  getBounceInUpVisibility(description, category) {
    if (description % 2 != 0) {
      if (category % 2 == 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  getBounceInLeftVisibility(description, category) {
    if (description % 2 == 0) {
      if (category % 2 != 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  getBounceInRightVisibility(description, category) {
    if (description % 2 == 0) {
      if (category % 2 == 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
