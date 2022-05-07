import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'check-book-registration-history-detail',
  templateUrl: './check-book-registration-history-detail.component.html',
  styleUrls: []
})
export class CheckBookRegistrationHistoryDetailComponent implements OnInit {
  @Input() rowData: any;
  @Input() dataSource: any;
  
  detailArray=[];
  constructor() { }

  ngOnInit(): void {
    this.detailArray=this.dataSource.filter(({ Id }) => this.rowData.Id == Id);
  }

}
