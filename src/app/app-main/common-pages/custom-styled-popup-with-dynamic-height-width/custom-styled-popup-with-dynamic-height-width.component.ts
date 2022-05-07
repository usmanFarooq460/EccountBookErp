import { Component, OnInit, Input, Output, EventEmitter,ContentChild, TemplateRef } from '@angular/core';
import { BaseActions } from 'src/app/shared/Base/BaseActions';

@Component({
  selector: 'app-custom-styled-popup-with-dynamic-height-width',
  templateUrl: './custom-styled-popup-with-dynamic-height-width.component.html',
  styleUrls: []
})
export class CustomStyledPopupWithDynamicHeightWidthComponent extends BaseActions implements OnInit {

  @Input() PopupHeading: string;
  @Input() PopupVisible: boolean=false;
  @Input() ReducePopupWidhtBy: number=0;
  @Input() ReducePopupHegihtBy: number=0;
  @Output() ClosePopup=new EventEmitter();
  @ContentChild(TemplateRef) public inputElement: TemplateRef<any>;
  constructor() 
  {
    super();
  }

  ngOnInit(): void {
  }
  Close()
  {
    this.PopupVisible=false;
    setTimeout(() => {
      this.ClosePopup.emit("0")
    }, 1001);
    
  }

}
