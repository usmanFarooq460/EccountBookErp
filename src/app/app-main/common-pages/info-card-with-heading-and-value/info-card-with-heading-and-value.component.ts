import { Component, OnInit ,Input, Output} from '@angular/core';
import { MostUsedMethods } from "src/app/shared/Base/mostUsedMethods"
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos"

@Component({
  selector: 'app-info-card-with-heading-and-value',
  templateUrl: './info-card-with-heading-and-value.component.html',
  styleUrls: ['./info-card-with-heading-and-value.component.scss']
})
export class InfoCardWithHeadingAndValueComponent implements OnInit {

  @Input() CardHeading: string;
  @Input() CardValue: number;
  @Input() Index: number;
  MostUsedMethods:MostUsedMethods;

  constructor(private commonMethods: CommonMethodsForCombos) 
  {
    this.MostUsedMethods=new MostUsedMethods(commonMethods)
  }

  ngOnInit(): void {
  }

}
