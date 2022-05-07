import { PdfReportsCommonServiceService } from "./pdf-reports-common-service.service";
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: "root",
})
export class PdfReportsCommonMethods {
  constructor(private service: PdfReportsCommonServiceService) {}
  async PurchaseOrderSlip_201(OrderId) {
    return await this.service.PurchaseOrderSlip_201({
      DocumentTypeId: 42,
      OrderId: OrderId,
      ApprovedFilter: "All",
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      CompanyName: sessionStorage.getItem("CompanyName"),
      ReportName: "201-InvRptPurchaseOrderGeneralSlip",
    });
  }
  async SaleInvoiceSlip_232(InvoiceId, DocumentTypeId: number = 60) {
    return await this.service.SaleInvoiceSlip_232({
      Id: InvoiceId,
      DocumentTypeId: DocumentTypeId,
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      CompanyName: sessionStorage.getItem("CompanyName"),
      ReportName: "232-RptSaleInvoiceSlip",
    });
  }
  async SaleInvoiceSlipB_232(InvoiceId, DocumentTypeId: number = 60) {
    return await this.service.SaleInvoiceSlip_232({
      Id: InvoiceId,
      DocumentTypeId: DocumentTypeId,
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      CompanyName: sessionStorage.getItem("CompanyName"),
      ReportName: "232-RptSaleInvoiceSlipB",
    });
  }
  async VoucherReport_104(VoucherHeadeId: number, DocumentTypeId: number) {
    return await this.service.VoucherReport_104_And_103({
      Id: VoucherHeadeId,
      //Compulosry
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      DocumentTypeId: DocumentTypeId,
      ApprovedFilter: "All",
      // CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      // CompanyName: sessionStorage.getItem("CompanyName"),
      ReportName: "104-AcRptGeneralJournalAcAndInventoryDetailSlip",
    });
  }
  async VoucherReport_103(VoucherHeadeId: number, DocumentTypeId: number) {
    return await this.service.VoucherReport_104_And_103({
      Id: VoucherHeadeId,
      //Compulosry
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      DocumentTypeId: DocumentTypeId,
      ApprovedFilter: "All",
      // CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      // CompanyName: sessionStorage.getItem("CompanyName"),
      ReportName: "103-AcRptPurchaseSalesVoucherSlip",
    });
  }
  async WsrmSaleInvoceSlip_716(InvoiceId) {
    return await this.service.WsrmSaleInvoiceSlip_700_And_716({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      Id: InvoiceId,
      ApprovedFilter: "All",
      CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      CompanyName: sessionStorage.getItem("CompanyName"),
      UserName: sessionStorage.getItem("DisplayName"),
      ReportName: "716-saleinvoicesSlip",
    });
  }
  async WsrmSaleInvoiceSlip_700(InvoiceId) {
    return await this.service.WsrmSaleInvoiceSlip_700_And_716({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      Id: InvoiceId,
      ApprovedFilter: "All",
      CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      CompanyName: sessionStorage.getItem("CompanyName"),
      UserName: sessionStorage.getItem("DisplayName"),
      ReportName: "700-Sp_WsrmSalesInvoiceSlip_Rpt",
    });
  }
  async RetailSaleInvoiceSlip_708(InvvoiceId) {
    return await this.service.RetailSaleInvoiceSlip_708_And_718({
      Id: InvvoiceId,
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      CompanyName: sessionStorage.getItem("CompanyName"),
      ReportName: "708-PosSaleInvoiceReport",
    });
  }
  async RetailSaleInvoiceSlip_718(InvoiceId) {
    return await this.service.RetailSaleInvoiceSlip_708_And_718({
      Id: InvoiceId,
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      CompanyName: sessionStorage.getItem("CompanyName"),
      ReportName: "718-PosSaleInvoiceSlip",
    });
  }
  async PurchaseInvoiceSlip_230(InvoiceId) {
    return await this.service.PurchaseInvoiceSlip_230({
      Id: InvoiceId,
      DocumentTypeId: 63,
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      CompanyName: sessionStorage.getItem("CompanyName"),
      ReportName: "230-RptPurchaseInvoiceSlip",
    });
  }
  async PosSaleReturnSlip_And_Register(ReportName, InvoiceId) {
    return await this.service.PosSaleReturnSlip_And_Register({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      CompanyName: sessionStorage.getItem("CompanyName"),
      UserName: sessionStorage.getItem("UserName"),
      ReportName: ReportName,
      Id: InvoiceId,
    });
  }
  async ExportPreShipmentAnalysisSlip_513(AnalysisId) {
    return await this.service.ExportPreShipmentAnalysisSlip_513({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      CompanyName: sessionStorage.getItem("CompanyName"),
      UserName: sessionStorage.getItem("UserName"),
      ReportName: "513-invLabPreProductionSlip",
      Id: AnalysisId,
    });
  }
  async ExportPreShipmentAnalysisRegister_514() {
    return await this.service.ExportPreShipmentAnalysisRegister_514({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      CompanyName: sessionStorage.getItem("CompanyName"),
      UserName: sessionStorage.getItem("UserName"),
      ReportName: "514-InvLabPreProductionRegister",
    });
  }
  //=====================================================5 April-2022
  async PurchaseOrderRiceSlip_203(PurchaseOrderId: number) {
    return await this.service.PurchaseOrderRiceSlip({
      DocumentTypeId: 41,
      OrderId: PurchaseOrderId,
      ApprovedFilter: "All",
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      CompanyName: sessionStorage.getItem("CompanyName"),
      ReportName: "203-InvRptPurchaseOrderRiceSlip",
    });
  }
  //======================================================6 April-2022
  async SaleOrderRiceSlip_273(SaleOrderId: number) {
    return await this.service.SaleOrderRiceSlip({
      DocumentTypeId: 81,
      Id: SaleOrderId,
      ApprovedFilter: "All",
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      CompanyName: sessionStorage.getItem("CompanyName"),
      ReportName: "273-InvRptSaleOrderSlip",
    });
  }
  //====================================================11 April-2022
  async GoodsReceiptNotesSlip_211(GdnId: number) {
    return await this.service.GoodsReceiptNotesSlip({
      DocumentTypeId: 46,
      Id: GdnId,
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      CompanyName: sessionStorage.getItem("CompanyName"),
      ReportName: "211-InvRptGoodsReceiptsNotesRiceSlip",
    });
  }
  //====================================================12 April-2022
  async GatePassInward_Import_Slip_802(GatePassId: number) {
    return await this.service.GatePassInward_Import_Slip_802({
      Id: GatePassId,
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      CompanyName: sessionStorage.getItem("CompanyName"),
      ReportName: "802-GatePassInward_Import_Slip",
    });
  }
  async GatePassInward_Slip_251(GatePassId: number) {
    return await this.service.GatePassInward_Slip_251({
      DocumentTypeId: 51,
      Id: GatePassId,
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      CompanyName: sessionStorage.getItem("CompanyName"),
      ReportName: "251-InvRptInwardGatePassSlip",
    });
  }
  async GatePassInward_SupplyOrder_Slip_331(GatePassId: number) {
    return await this.service.GatePassInward_SupplyOrder_Slip_331({
      DocumentTypeId: 51,
      Id: GatePassId,
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      CompanyName: sessionStorage.getItem("CompanyName"),
      ReportName: "331-GatePassInwardAgainstSupplyOrder",
    });
  }
  async ImportContract_Slip_801(ContractId: number) {
    return await this.service.ImportContract_Slip_801({
      Id: ContractId,
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      CompanyAddress: sessionStorage.getItem("CompanyAddress"),
      CompanyName: sessionStorage.getItem("CompanyName"),
      ReportName: "801-ImpContractSlip",
    });
  }
}
