import { Component, OnInit, Input, Output , EventEmitter} from "@angular/core";

@Component({
  selector: "app-common-forms-collection-for-heperlinks",
  templateUrl: "./common-forms-collection-for-heperlinks.component.html",
  styleUrls: ["./common-forms-collection-for-heperlinks.component.scss"],
})
export class CommonFormsCollectionForHeperlinksComponent implements OnInit {
  @Input() DocumentId: number;
  @Input() DocumentTypeId: number;
  @Input() CompanyId: number;
  
  @Input() CollectionOfFormsPopupVisible: boolean=false;
  @Output() ColseComponent=new EventEmitter();
  CollectionOfFormsObject = [
    {
      Id: 0,
      Label: "Payment Voucher",
      Status: false,
      DocumentTypeIds: [1, 2],
      ScreenName: "PaymentVoucherNew",
    },
  ];

  constructor() {
    console.log("Inside Collection of Forms Component!")
    console.log(this.DocumentId)
    console.log(this.DocumentId)
  }
  ngOnInit() {
    console.log("Inside Collection of Forms Component!")
    console.log(this.DocumentId)
    console.log(this.DocumentId)
    this.OpenFormAgainstDocumentTypeId()
  }

  CloseCollectionOfFormsPopup(e) {
    this.CollectionOfFormsObject.map((item) => (item.Status = false));
    this.ColseComponent.emit("0");
  }
  OpenFormAgainstDocumentTypeId()
  {
    for(let i=0;i<this.CollectionOfFormsObject.length;i++)
    {
      let flag=false;
      for(let j=0;j<this.CollectionOfFormsObject[i].DocumentTypeIds.length;j++)
      {
        if(this.DocumentTypeId==this.CollectionOfFormsObject[i].DocumentTypeIds[j])
        {
          flag=true;
          break;
        }
      }
      if(flag==true)
      {
        this.CollectionOfFormsObject[i].Status=true;
        break;
      }
    }
  }
}
