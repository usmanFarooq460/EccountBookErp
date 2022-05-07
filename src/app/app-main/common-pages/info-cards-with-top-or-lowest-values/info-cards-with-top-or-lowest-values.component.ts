import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MostUsedMethods } from "src/app/shared/Base/mostUsedMethods"
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos"
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
@Component({
  selector: 'app-info-cards-with-top-or-lowest-values',
  templateUrl: './info-cards-with-top-or-lowest-values.component.html',
  styleUrls: ['./info-cards-with-top-or-lowest-values.component.scss']
})
export class InfoCardsWithTopOrLowestValuesComponent implements OnInit {
  @Input() Heading: string
  @Input() Index:number;
  @Input() Title: string;
  @Input() SubTitle: string;
  @Input() Value: number;
  @Input() UniqueId: any;
  @Output() MoreInfoClicked=new EventEmitter()
  MostUsedMethods:MostUsedMethods;
  constructor(private commonMethods: CommonMethodsForCombos) 
  {
    this.MostUsedMethods=new MostUsedMethods(commonMethods)
  }

  ngOnInit(){

  }
  handleMoreInfoClicked(Id)
  {
    this.MoreInfoClicked.emit(Id)
  }

}
