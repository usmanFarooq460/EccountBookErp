import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UiModule } from "src/app/shared/ui/ui.module";
import {
  DxButtonModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxFormModule,
  DxNumberBoxModule,
  DxPopoverModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxSpeedDialActionModule,
  DxTextBoxModule,
  DxDropDownBoxModule,
  DxScrollViewModule,
  DxTooltipModule,
  DxChartModule,
  DxLoadPanelModule,
} from "devextreme-angular";
import { InvoiceHistoryComponent } from "./invoice-history/invoice-history.component";
import { CustomPdfReportsModule } from "src/app/app-main/custom-pdf-reports/custom-pdf-reports.module";
import { FilterByAllPropertiesPipe } from "./invoice-history/filter-by-all-properties.pipe";
import { InfoCardWithHeadingAndValueComponent } from "./info-card-with-heading-and-value/info-card-with-heading-and-value.component";
import { InfoCardsWithTopOrLowestValuesComponent } from "./info-cards-with-top-or-lowest-values/info-cards-with-top-or-lowest-values.component";

import { CustomStyledPopupWithDynamicHeightWidthComponent } from './custom-styled-popup-with-dynamic-height-width/custom-styled-popup-with-dynamic-height-width.component';

import { SuppCustDetailUnderComboComponent } from './supp-cust-detail-under-combo/supp-cust-detail-under-combo.component'
// import { SupplierPurchasesModule } from "src/app/app-main/supplier-purchases/supplier-purchases.module"
// import { ExportDefinitionModule } from "src/app/app-main/export-definition/export-definition.module"
@NgModule({
  declarations: [
    InvoiceHistoryComponent,
    FilterByAllPropertiesPipe,
    InfoCardWithHeadingAndValueComponent,
    InfoCardsWithTopOrLowestValuesComponent,

    CustomStyledPopupWithDynamicHeightWidthComponent,
    SuppCustDetailUnderComboComponent,
  ],
  imports: [
    CommonModule,
    UiModule,
    DxButtonModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxFormModule,
    DxNumberBoxModule,
    DxPopoverModule,
    DxPopupModule,
    DxSelectBoxModule,
    DxLoadPanelModule,
    DxSpeedDialActionModule,
    DxTextBoxModule,
    DxDropDownBoxModule,
    DxScrollViewModule,
    DxTooltipModule,
    DxChartModule,
    CustomPdfReportsModule,
    // SupplierPurchasesModule,
//  ExportDefinitionModule,
  ],
  exports: [
    InvoiceHistoryComponent,
    FilterByAllPropertiesPipe,
    InfoCardWithHeadingAndValueComponent,
    InfoCardsWithTopOrLowestValuesComponent,

    CustomStyledPopupWithDynamicHeightWidthComponent,
    SuppCustDetailUnderComboComponent,
  ],
})
export class CommonPagesModule {}
