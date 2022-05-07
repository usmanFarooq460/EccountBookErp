import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GdnHistoryComponent } from "./gdn-history";
import { GrnHistoryComponent } from "./grn-history";
import { ItemLedgerComponent } from "./item-ledger";
import { PurchaseInvoiceRegisterComponent } from "./purchase-invoice-register";
import { PurchaseOrderRegisterComponent } from "./purchase-order-register";
import { SaleOrderHistoryComponent } from "./sale-order-history";
import { gatePassInwardHistoryComponent } from "./gatepass-inward-history";
import { gatePassOutwardHistoryComponent } from "./gatepass-outward-history";
import { weighBridgeHistoryComponent } from "./weigh-bridge-history";
import { ItemListComponent } from "./item-list";
import { SaleInvoiceHistoryComponent } from "./sale-invoice-history";
import { SaleInvoiceDirectRegisterComponent } from "./sale-invoice-direct-register";
import { SaleInvoiceTradeProSlipComponent } from "./sale-invoice-tradePro-slip";
import { PurchaseInvoiceTradingComponent } from "./purchase-invoice-trading-register";
import { SaleInvoiceTradingComponent } from "./Sale-invoice-trading-register";
import { DeliveryOrderHistoryComponent } from "./delivery-order-history";
import { ScreenGuard } from "src/app/account/auth/screen-guard";
import { PurchaseOrderTradingRegisterComponent } from "./purchase-order-trading-register";
import { SupplierListComponent} from "./supplier-list/supplier-list.component"
const routes: Routes = [
  { path: "gdn-history", component: GdnHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["frmGDNHistory"] } },
  { path: "grn-history", component: GrnHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["frmGRNHistory"] } },
  { path: "item-ledger", component: ItemLedgerComponent },
  { path: "purchase-invoice-register", component: PurchaseInvoiceRegisterComponent, canActivate: [ScreenGuard], data: { screenName: ["frmPurchaseInvoiceHistory"] } },
  { path: "purchase-order-register", component: PurchaseOrderRegisterComponent, canActivate: [ScreenGuard], data: { screenName: ["PurchaseOrderHistory"] } },
  { path: "sale-order-history", component: SaleOrderHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["frmSaleOrderHistory"] } },
  { path: "gatepass-Inward-history", component: gatePassInwardHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["frmGatePassReport"] } },
  { path: "gatepass-outward-history", component: gatePassOutwardHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["frmGPOutward"] } },
  { path: "sale-invoice-history", component: SaleInvoiceHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["frmSaleInvoiceHistory"] } },
  { path: "sale-invoice-direct-register", component: SaleInvoiceDirectRegisterComponent },
  { path: "weighbridge-history", component: weighBridgeHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["frmWeightBridgeHistory"] } },
  { path: "item-List", component: ItemListComponent, canActivate: [ScreenGuard], data: { screenName: ["frmRptItemList"] } },
  { path: "sale-invoice-trade-pro-slip", component: SaleInvoiceTradeProSlipComponent },
  { path: "purchase-invoice-trading", component: PurchaseInvoiceTradingComponent, canActivate: [ScreenGuard], data: { screenName: ["PurchaseInvoiceTrading"] } },
  { path: "sale-invoice-trading", component: SaleInvoiceTradingComponent, canActivate: [ScreenGuard], data: { screenName: ["SaleInvoiceTrading"] } },
  { path: "delivery-order-history", component: DeliveryOrderHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["frmDeliveryOrderForApprovel"] } },
  { path: "purchase-order-trading-register", component: PurchaseOrderTradingRegisterComponent },
  { path: "supplier-list", component: SupplierListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryReportsRoutingModule {}
