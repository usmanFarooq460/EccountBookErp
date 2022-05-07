import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PagetitleComponent } from "./pagetitle/pagetitle.component";
import { NotificationPopups } from "./warninng-popup/warninng-popup.component";
import { GlobalButtonsComponent } from "./global-buttons/global-buttons.component";
import { LoaderForAvailableTransactionsForIssuanceComponent } from "./loader-for-available-transactions-for-issuance/loader-for-available-transactions-for-issuance.component";
import { LoadPanelComponent } from "./load-panel/load-panel.component";
import { StockAgainstQtyForIssuanceLoaderComponent } from "./loader-for-available-stock-against-qty/loader-for-available-stock-against-qty-for-issuance.component";
import { DxButtonModule, DxLoadPanelModule, DxLoadIndicatorModule, DxPopupModule, DxScrollViewModule, DxDataGridModule, DxSpeedDialActionModule, DxFormModule,} from "devextreme-angular";
@NgModule({
  declarations: [LoaderForAvailableTransactionsForIssuanceComponent,PagetitleComponent, NotificationPopups, LoadPanelComponent, StockAgainstQtyForIssuanceLoaderComponent, GlobalButtonsComponent],
  imports: [CommonModule, DxButtonModule, DxLoadIndicatorModule, DxLoadPanelModule, DxPopupModule, DxScrollViewModule, DxDataGridModule, DxSpeedDialActionModule, DxFormModule],
  exports: [PagetitleComponent, NotificationPopups, LoadPanelComponent, StockAgainstQtyForIssuanceLoaderComponent, GlobalButtonsComponent,LoaderForAvailableTransactionsForIssuanceComponent],
})
export class UiModule {}
