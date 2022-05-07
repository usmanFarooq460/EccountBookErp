import { Component, Input, OnInit } from "@angular/core";
import { PyablesRecievablesAgingService } from "../payables-recievables.service";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
@Component({
  selector: "detail-view",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class PayablesRecievablesDetailComponent implements OnInit {
  @Input() key: number;
  @Input() rowData: object;
  SaleInvoiceDocumentTypeIds: string;
  dataSource: any;
  newList: any;
  SupplierCustomerId: number;
  SupplierCustomerList = [];
  parameter: string;
  constructor(private service: PyablesRecievablesAgingService, private commonService: CommonBaseService) {}

  ngOnInit(): void {
    // this.SupplierCustomer();
    this.SaleInvoiceDocumentTypeIdsGet();
    // this.getDataByRowId();
  }

  SaleInvoiceDocumentTypeIdsGet() {
    this.commonService
      .configurations({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => {
          for (let { ConfigDescription, ConfigKey } of result) {
            if (ConfigDescription === "ReceiptsByInvoiceSalesInvoice") {
              if (ConfigKey) {
                this.SaleInvoiceDocumentTypeIds = ConfigKey;
                this.parameter = this.SaleInvoiceDocumentTypeIds;

                this.service
                  .SupplierCustomer({
                    CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
                    OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
                  })
                  .subscribe(
                    (result) => {
                      this.newList = result.filter(({ GlAccountId }) => GlAccountId == this.key);
                      this.SupplierCustomerId = parseInt(this.newList[0].Id);
                    },
                    (error) => console.log(error)
                  );

                this.service
                  .GetReceivablesByInvoice({
                    CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
                    OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
                    SaleInvoiceDocumentTypeIds: ConfigKey,
                    SupplierCustomerId: this.SupplierCustomerId,
                  })
                  .subscribe(
                    (result) => {
                      this.dataSource = result;
                    },
                    (error) => console.log(error)
                  );
              }
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  // SupplierCustomer() {
  //   this.service
  //     .SupplierCustomer({
  //       CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
  //       OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
  //     })
  //     .subscribe(
  //       (result) => {
  //         this.newList = result.filter(({ GlAccountId }) => GlAccountId == this.key);
  //         this.SupplierCustomerId = parseInt(this.newList[0].Id);
  //       },
  //       (error) => console.log(error)
  //     );
  // }

  // getDataByRowId() {
  //   this.service
  //     .GetReceivablesByInvoice({
  //       CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
  //       OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
  //       SaleInvoiceDocumentTypeIds: this.parameter,
  //       SupplierCustomerId: this.SupplierCustomerId,
  //     })
  //     .subscribe(
  //       (result) => {
  //         this.dataSource = result;
  //       },
  //       (error) => console.log(error)
  //     );
  // }
}
