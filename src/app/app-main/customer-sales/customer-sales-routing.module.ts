import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GatePassOutwardFormComponent, GatePassOutwardFormHistoryComponent } from "./gate-pass-outward";
import { GoodsDispatchNotesRiceFormComponent, GoodsDispatchNotesRiceHistoryComponent, GdnDetailComponent } from "./goods-dispatch-notes-rice";

import { SaleInvoiceFormComponent, SaleInvoiceHistoryComponent, SaleInvoiceDetailComponent } from "./sale-invoice";
import { SaleOrderFormComponent, SaleOrderHistoryComponent } from "./sale-order";
import { DeliveryOrderFormComponent, DeliveryOrderHistoryComponent } from "./delivery-order";
import { ScreenGuard } from "src/app/account/auth/screen-guard";

import { PurchaseOrderFormComponent, PurchaseOrderHistoryComponent } from "./purchase-order";
import { PreProductionLabFormComponent, PreProductionLabHistoryComponent } from "./pre-production-lab";
import { PurchaseInvoiceFormComponent, PurchaseInvoiceHistoryComponent } from "./purchase-invoice";
import { FcyBankReceiptDesignComponent } from "./fcy-bank-receipt-design/fcy-bank-receipt-design.component";

import { FcBankReceiptFormComponent, FcReceiptBankHistoryComponent } from "./fc-bank-receipt";
import { FcyPaymentHistoryComponent, FcyPayementFormComponent } from "./fcy-payment";
import { GatePassInwardFormComponent, GatePassInwardHistoryComponent } from "./gate-pass-inward";

import { ShortCutKeysNewDesignComponent } from './short-cut-keys-new-design/short-cut-keys-new-design.component';

const routes: Routes = [
  { path: "sale-order-form", component: SaleOrderFormComponent, canActivate: [ScreenGuard], data: { screenName: ["SaleOrder"] } },
  { path: "sale-order-history", component: SaleOrderHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["SaleOrder"] } },
  { path: "delivery-order-form", component: DeliveryOrderFormComponent, canActivate: [ScreenGuard], data: { screenName: ["DeliveryOrder"] } },
  { path: "delivery-order-history", component: DeliveryOrderHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["DeliveryOrder"] } },
  { path: "gatepass-outward-form", component: GatePassOutwardFormComponent }, //, canActivate: [ScreenGuard], data: { screenName: ["OutwardGatePass"] }
  { path: "gatepass-outward-history", component: GatePassOutwardFormHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["OutwardGatePass"] } },
  { path: "goods-dispatch-notes-form", component: GoodsDispatchNotesRiceFormComponent }, //, canActivate: [ScreenGuard], data: { screenName: ["InvfrmGDN"] }
  { path: "goods-dispatch-notes-history", component: GoodsDispatchNotesRiceHistoryComponent }, //, canActivate: [ScreenGuard], data: { screenName: ["InvfrmGDN"] }

  { path: "sale-invoice-form", component: SaleInvoiceFormComponent, canActivate: [ScreenGuard], data: { screenName: ["InvfrmSaleInvoice"] } },
  { path: "sale-invoice-history", component: SaleInvoiceHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["InvfrmSaleInvoice"] } },

  { path: "purchase-order-history", component: PurchaseOrderHistoryComponent },
  { path: "purchase-order-form", component: PurchaseOrderFormComponent },

  { path: "pre-production-history", component: PreProductionLabHistoryComponent },
  { path: "pre-production-form", component: PreProductionLabFormComponent },

  { path: "purchase-invoice-form", component: PurchaseInvoiceFormComponent },
  { path: "purchase-invoice-history", component: PurchaseInvoiceHistoryComponent },
  { path: "FCY-bank-Receipt-design", component: FcyBankReceiptDesignComponent },

  { path: "fc-bank-receipt-form", component: FcBankReceiptFormComponent },
  { path: "fc-bank-receipt-history", component: FcReceiptBankHistoryComponent },

  { path: "fcy-payment-voucher-form", component: FcyPayementFormComponent },
  { path: "fcy-payment-voucher-history", component: FcyPaymentHistoryComponent },

  { path: "gatepass-inward-form", component: GatePassInwardFormComponent },
  { path: "gatepass-inward-history", component: GatePassInwardHistoryComponent },


  { path: "Keys-new-design", component: ShortCutKeysNewDesignComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerSalesRoutingModule {}
