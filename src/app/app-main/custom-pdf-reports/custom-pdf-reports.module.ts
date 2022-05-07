import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceOneComponent } from './invoice-one-blue/invoice-one.component';
import { UiModule } from 'src/app/shared/ui/ui.module';


@NgModule({
  declarations: [InvoiceOneComponent],
  imports: [
    CommonModule,
    UiModule
  ],
  exports:[
    InvoiceOneComponent
  ]
})
export class CustomPdfReportsModule { }
