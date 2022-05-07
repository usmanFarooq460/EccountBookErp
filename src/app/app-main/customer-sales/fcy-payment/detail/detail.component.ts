import { Component, Input, OnInit } from "@angular/core";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { FcyPaymentService } from "../fcy-payment.service";

@Component({
  selector: "fcy-payment-history-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class FcyPaymentHistoryDetailComponent extends BaseActions implements OnInit {
  @Input() rowData: any;
  detailArray = [];

  constructor(private service: FcyPaymentService) {
    super();
  }

  ngOnInit(): void {
    console.log("Checking row data: ", this.rowData);
    console.log("Checking row data Id: ", this.rowData.Id);
    this.GetById(this.rowData.Id);
  }

  GetById(Id) {
    this.service.GetBYId(Id).subscribe(
      (result: any) => {
        console.log(result);
        this.detailArray = result.ExImFcBankPaymentsDeductionslst;
      },
      (error) => {
        this.HandleError(error);
      }
    );
  }
}
