export class WsrmRequistionOrderModel {
    Id: number; //   Id
    SourceLocationId: number; //   SourceLocationId
    DestinationLocationId: number; //   DestinationLocationId
    DocDate: Date; //   DocDate
    DocNo: number; //   DocNo
    RemarksHeader: string; //   RemarksHeader
    OrganizationId: number; //   OrganizationId*
    CompanyId: number; //   CompanyId*
    BranchesId: number; //   BranchesId*
    EntryUserId: number; //   EntryUserId*
    EntryDate: Date; //   EntryDate*
    ModifyUserId: number; //   ModifyUserId*
    ModifyDate: Date; //   ModifyDate*
    IsApproved: boolean; //   IsApproved*
    ApprovedUserId: number; //   ApprovedUserId*
    ApprovedDate: Date; //   ApprovedDate*
    ReqStatus: number; //   ReqStatus
    HoApprovalDate: Date; //   HoApprovalDate***
    HoApprovedUserId: number; //   HoApprovedUserId
    HoComments: string; //   HoComments
    HoIsApproved: boolean; //   HoIsApproved
    WsRmRequisitionPoDetailsList = new Array<WsrmRequisitionOrderDetailModel>();
  }
  
  export class WsrmRequisitionOrderDetailModel {
    Id: number; //   Id
    WsRmRequisitionPoId: number; //   WsRmRequisitionPoId
    ItemId: number; //   ItemId
    ItemUomId: number; //   ItemUomId
    ReqQty: number; //   ReqQty
    ReqRate: number; //   ReqRate
    ReqAmount: number; //   ReqAmount
    RemarksDetail: string; //   RemarksDetail
    ApprovedQty: number; //   ApprovedQty
    ItemName: string;
    UOMDescription: string;
    sotckInHand: number;
  }
  