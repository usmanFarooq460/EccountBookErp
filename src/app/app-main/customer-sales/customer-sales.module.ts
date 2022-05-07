import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomerSalesRoutingModule } from "./customer-sales-routing.module";
import { SaleOrderRiceFormComponent, SaleOrderRiceHistoryComponent } from "./sale-order-rice";
import { DeliveryOrderFormComponent, DeliveryOrderHistoryComponent, DeliveryOrderDetailComponent } from "./delivery-order";
import { GatePassOutwardFormComponent, GatePassOutwardFormHistoryComponent } from "./gate-pass-outward";
import { GoodsDispatchNotesRiceFormComponent, GoodsDispatchNotesRiceHistoryComponent, GdnDetailComponent } from "./goods-dispatch-notes-rice";

import { SaleInvoiceFormComponent, SaleInvoiceHistoryComponent, SaleInvoiceDetailComponent, SalInvoiceLoaderComponent } from "./sale-invoice";
import { SaleOrderFormComponent, SaleOrderHistoryComponent } from "./sale-order";
import { UiModule } from "src/app/shared/ui/ui.module";
import {
  DxAccordionModule,
  DxButtonModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxFormModule,
  DxNumberBoxModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxSpeedDialActionModule,
  DxSwitchModule,
  DxTabPanelModule,
  DxTextBoxModule,
  DxTextAreaModule,
  DxLoadPanelModule,
  DxScrollViewModule,
  DxRadioGroupModule,
} from "devextreme-angular";

import { SaleInvoiceDirectFormComponent, SaleInvoiceDirectHistoryComponent, SaleInvoiceDirectDetailComponent } from "./sale-invoice-direct";
import { CommonPagesModule } from "../common-pages/common-pages.module";
import { SaleOrderLoaderComponent } from "./delivery-order/sale-order-loader/sale-order-loader.component";

import { PurchaseOrderFormComponent, PurchaseOrderHistoryComponent, ImportPurchaseOrderDetailComponent } from "./purchase-order";
import { PreProductionLabFormComponent, PreProductionLabHistoryComponent } from "./pre-production-lab";
import {
  PurchaseInvoiceFormComponent,
  PurchaseInvoiceHistoryComponent,
  // PurchaseInvoiceDetailComponent,
  PurchaseInvoiceLoaderComponent,
  PurchaseInvoiceLoaderDetailComponent,
  PurchaseInvoiceHistoryDetailComponent,
} from "./purchase-invoice";
import { FcyBankReceiptDesignComponent } from "./fcy-bank-receipt-design/fcy-bank-receipt-design.component";
import { FcBankReceiptFormComponent, FcReceiptBankHistoryComponent } from "./fc-bank-receipt";
// import { FcyBankRecieptDesignComponent } from './fcy-bank-receipt-design/fcy-bank-reciept-design/fcy-bank-reciept-design.component';
// import { PurchaseInvoiceHistoryDetailComponent } from './purchase-invoice/history/purchase-invoice-history-detail/purchase-invoice-history-detail.component';
import { FcyPaymentHistoryComponent, FcyPaymentHistoryDetailComponent, FcyPayementFormComponent } from "./fcy-payment";
import { GatePassInwardFormComponent, GatePassInwardHistoryComponent } from "./gate-pass-inward";
import { ShortCutKeysNewDesignComponent } from './short-cut-keys-new-design/short-cut-keys-new-design.component';

@NgModule({
  declarations: [
    DeliveryOrderFormComponent,
    DeliveryOrderHistoryComponent,
    SaleOrderRiceFormComponent,
    SaleOrderRiceHistoryComponent,
    SaleOrderFormComponent,
    SaleOrderHistoryComponent,
    GatePassOutwardFormComponent,
    GatePassOutwardFormHistoryComponent,
    GoodsDispatchNotesRiceFormComponent,
    GoodsDispatchNotesRiceHistoryComponent,
    SaleInvoiceFormComponent,
    SaleInvoiceHistoryComponent,
    SaleInvoiceDetailComponent,
    DeliveryOrderDetailComponent,
    GdnDetailComponent,
    SaleInvoiceDirectFormComponent,
    SaleInvoiceDirectHistoryComponent,
    SaleInvoiceDirectDetailComponent,
    SaleOrderLoaderComponent,
    SalInvoiceLoaderComponent,
    PurchaseOrderFormComponent,
    PurchaseOrderHistoryComponent,
    ImportPurchaseOrderDetailComponent,
    PreProductionLabHistoryComponent,
    PreProductionLabFormComponent,

    PurchaseInvoiceFormComponent,
    PurchaseInvoiceHistoryComponent,
    PurchaseInvoiceLoaderComponent,
    PurchaseInvoiceLoaderDetailComponent,
    PurchaseInvoiceHistoryDetailComponent,
    FcyBankReceiptDesignComponent,
    // FcyBankRecieptDesignComponent,

    FcBankReceiptFormComponent,
    FcReceiptBankHistoryComponent,
    FcyPaymentHistoryComponent,
    FcyPaymentHistoryDetailComponent,
    FcyPayementFormComponent,

    GatePassInwardFormComponent,
    GatePassInwardHistoryComponent,
    ShortCutKeysNewDesignComponent,
  ],
  imports: [
    CommonModule,
    DxNumberBoxModule,
    DxTabPanelModule,
    DxAccordionModule,
    DxSpeedDialActionModule,
    DxSwitchModule,
    CustomerSalesRoutingModule,
    UiModule,
    DxButtonModule,
    DxDataGridModule,
    DxFormModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxPopupModule,
    DxDateBoxModule,
    DxTextAreaModule,
    DxLoadPanelModule,
    DxScrollViewModule,
    CommonPagesModule,
    DxRadioGroupModule,
  ],
})
export class CustomerSalesModule {}
