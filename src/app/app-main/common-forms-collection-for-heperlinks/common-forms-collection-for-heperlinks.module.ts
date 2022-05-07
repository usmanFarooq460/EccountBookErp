import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFormsCollectionForHeperlinksComponent } from "./common-forms-collection-for-heperlinks/common-forms-collection-for-heperlinks.component";
// import { AccountTransactionModule } from "src/app/app-main/account-transaction/account-transaction.module";
import { CommonPagesModule } from ".././common-pages/common-pages.module"
@NgModule({
  declarations: [CommonFormsCollectionForHeperlinksComponent],
  imports: [
    CommonModule,
    // AccountTransactionModule,
    CommonPagesModule
  ],
  exports:[
    CommonFormsCollectionForHeperlinksComponent
  ]
})
export class CommonFormsCollectionForHeperlinksModule { }
