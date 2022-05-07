import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { InventoryReportsRoutingModule } from "./inventory-reports-routing.module";
import { GdnHistoryComponent } from "./gdn-history";
import { GrnHistoryComponent } from "./grn-history";
import { ItemLedgerComponent } from "./item-ledger";
import { PurchaseInvoiceRegisterComponent } from "./purchase-invoice-register";
import { PurchaseOrderRegisterComponent, PurchaseOrderRegisterDetail } from "./purchase-order-register";
import { SaleOrderHistoryComponent } from "./sale-order-history";
import { gatePassInwardHistoryComponent } from "./gatepass-inward-history";
import { gatePassOutwardHistoryComponent } from "./gatepass-outward-history";
import { weighBridgeHistoryComponent } from "./weigh-bridge-history";
import { SaleInvoiceHistoryComponent } from "./sale-invoice-history";
import { SaleInvoiceDirectRegisterComponent } from "./sale-invoice-direct-register";
import { ItemListComponent } from "./item-list";
import { UiModule } from "src/app/shared/ui/ui.module";
import {
  DxButtonModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxFormModule,
  DxPopupModule,
  DxScrollViewModule,
  DxPopoverModule,
  DxChartModule,
  DxSelectBoxModule,
  DxTextBoxModule,
} from "devextreme-angular";
import { SaleInvoiceTradeProSlipComponent } from "./sale-invoice-tradePro-slip";
import { PurchaseInvoiceTradingComponent } from "./purchase-invoice-trading-register";
import { SaleInvoiceTradingComponent } from "./Sale-invoice-trading-register";
import { DeliveryOrderHistoryComponent } from "./delivery-order-history";
import { PurchaseOrderTradingRegisterComponent, PurchaseOrderTradingRegisterDetailComponent } from "./purchase-order-trading-register";
import { CustomerDetailComponent} from "./customer-detail/customer-detail.component";
import { SupplierListComponent } from './supplier-list/supplier-list.component'
@NgModule({
  declarations: [
    GdnHistoryComponent,
    GrnHistoryComponent,
    ItemLedgerComponent,
    PurchaseInvoiceRegisterComponent,
    PurchaseOrderRegisterComponent,
    PurchaseOrderRegisterDetail,
    SaleOrderHistoryComponent,
    gatePassInwardHistoryComponent,
    gatePassOutwardHistoryComponent,
    weighBridgeHistoryComponent,
    SaleInvoiceHistoryComponent,
    SaleInvoiceDirectRegisterComponent,
    ItemListComponent,
    SaleInvoiceTradeProSlipComponent,
    PurchaseInvoiceTradingComponent,
    SaleInvoiceTradingComponent,
    DeliveryOrderHistoryComponent,
    PurchaseOrderTradingRegisterComponent,
    PurchaseOrderTradingRegisterDetailComponent,
    CustomerDetailComponent,
    SupplierListComponent
  ],
  imports: [
    CommonModule,
    InventoryReportsRoutingModule,
    UiModule,
    DxButtonModule,
    DxDataGridModule,
    DxFormModule,
    DxChartModule,
    DxPopupModule,
    DxScrollViewModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxPopoverModule,
    DxDateBoxModule,
  ],
  exports:[
    CustomerDetailComponent
  ]
})
export class InventoryReportsModule {}
