import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SaleOrderApprovalComponent } from "./sale-order-approval/sale-order-approval.component";
import { SaleInoviceApprovalComponent } from "./sale-invoice-approval/sale-invoice-approval.component";
import { ImportInvoiceApprovalComponent } from "./import-invoice-approval/import-invoice-approval.component";
import {
  DxButtonModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxFormModule,
  DxPopoverModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxNumberBoxModule,
  DxPopupModule,
  DxSpeedDialActionModule,
  DxSwitchModule,
  DxTabPanelModule,
  DxAccordionModule,
  DxTooltipModule,
} from "devextreme-angular";
import { UiModule } from "src/app/shared/ui/ui.module";
import { WsrmSaleInvoiceApprovalComponent } from "./wsrm-sale-invoice-approval/wsrm-sale-invoice-approval.component";
import { WsrmSaleInvoiceApprovalDetialComponent } from "./wsrm-sale-invoice-approval/detail/detail.component";
import { ImportPurchaseOrderApprovalComponent } from "./import-purchase-order-approval/import-purchase-order-approval.component";
import { ImportPurchaseOrderApprovalDetailComponent } from "./import-purchase-order-approval/detail/detail.component";
import { WsrmSaleOrderApprovalComponent } from "./wsrm-sale-order-approval/wsrm-sale-order-approval.component";
import { WsrmSaleOrderApprovalDetailComponent } from "./wsrm-sale-order-approval/detail/detail.component";
import { ImportContractApprovalComponent } from "./import-contract-approval/import-contract-approval.component";
import { ImportContractApprovalDetailComponent } from "./import-contract-approval/detail/detail.component";
import { SaleReturnTradingApprovalComponent } from "./sale-return-trading-approval/sale-return-trading-approval.component";
import { SaleReturnTradingApprovalDetailComponent } from "./sale-return-trading-approval/detail/detail.component";
import { PurchaseReturnTradingApprovalComponent } from "./purchase-return-trading-approval/purchase-return-trading-approval.component";
import { PurchaseReturnTradingApprovalDetailComponent } from "./purchase-return-trading-approval/detail/detail.component";
import { PurchaseOrderTradingApprovalComponent } from "./purchase-order-trading-approval/purchase-order-trading-approval.component";
import { PurchaseOrderTradingApprovalDetailComponent } from "./purchase-order-trading-approval/detail/detail.component";
import { PurchaseInvoiceTradingApprovalComponent } from "./purchase-invoice-trading-approval/purchase-invoice-trading-approval.component";
import { PurchaseInvoiceTradingApprovalDetailComponent } from "./purchase-invoice-trading-approval/detail/detail.component";

@NgModule({
  declarations: [
    SaleOrderApprovalComponent,
    SaleInoviceApprovalComponent,
    ImportInvoiceApprovalComponent,
    WsrmSaleInvoiceApprovalComponent,
    WsrmSaleInvoiceApprovalDetialComponent,
    ImportPurchaseOrderApprovalComponent,
    ImportPurchaseOrderApprovalDetailComponent,
    WsrmSaleOrderApprovalComponent,
    WsrmSaleOrderApprovalDetailComponent,
    ImportContractApprovalComponent,
    ImportContractApprovalDetailComponent,
    SaleReturnTradingApprovalComponent,
    SaleReturnTradingApprovalDetailComponent,
    PurchaseReturnTradingApprovalComponent,
    PurchaseReturnTradingApprovalDetailComponent,
    PurchaseOrderTradingApprovalComponent,
    PurchaseOrderTradingApprovalDetailComponent,
    PurchaseInvoiceTradingApprovalComponent,
    PurchaseInvoiceTradingApprovalDetailComponent,
  ],
  imports: [
    CommonModule,
    DxButtonModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxFormModule,
    DxPopoverModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    DxPopupModule,
    DxSpeedDialActionModule,
    DxSwitchModule,
    DxTabPanelModule,
    DxAccordionModule,
    DxTooltipModule,
    UiModule,
  ],
  exports: [
    SaleOrderApprovalComponent,
    SaleInoviceApprovalComponent,
    ImportInvoiceApprovalComponent,
    WsrmSaleInvoiceApprovalComponent,
    ImportPurchaseOrderApprovalComponent,
    WsrmSaleOrderApprovalComponent,
    ImportContractApprovalComponent,
    SaleReturnTradingApprovalComponent,
    PurchaseReturnTradingApprovalComponent,
    PurchaseOrderTradingApprovalComponent,
    PurchaseInvoiceTradingApprovalComponent,
  ],
})
export class InventoryApprovalModule {}
