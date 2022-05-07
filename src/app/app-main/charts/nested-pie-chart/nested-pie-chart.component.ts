import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-nested-pie-chart',
  templateUrl: './nested-pie-chart.component.html',
  styleUrls: ['./nested-pie-chart.component.scss']
})
export class NestedPieChartComponent implements OnInit {
  @Input() LegendsData:Array<string>;
  @Input() InnerChartSeriesName: string;
  @Input() OuterChartSeriesName: string;
  @Input() InnerChartSeriesData: Array<{value:number,name:string}>;
  @Input() OuterChartSeriesData: Array<{value:number,name:string}>;

  ChartOptions ;
  constructor() { 
    
  }

  ngOnInit() {
    this.GenerateChartOptions()
  }
  
  GenerateChartOptions()
  {


    this.ChartOptions= {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      // toolbox: {
      //   show: true,
      //   orient:'horizontal',
        
      //   feature: {
      //     mark: { show: true },
      //     dataView: { show: true, readOnly: true },
      //     restore: { show: true },
      //     saveAsImage: { show: true },
      //   //   dataZoom:{show:true},
      //   //    magicType: {
      //   //     type: ['line', 'bar', 'stack']
      //   // }
      //   }
      // },
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        data: this.LegendsData
      },
      series: [
        {
          name: this.InnerChartSeriesName,
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '30%'],
          label: {
            position: 'inner',
            fontSize: 14
          },
          labelLine: {
            show: false
          },
          data: this.InnerChartSeriesData
        },

        {
          name: this.OuterChartSeriesName,
          type: 'pie',
          radius: ['45%', '60%'],
          labelLine: {
            length: 30
          },
          // color:[
          //   '#0AC083',
          //   '#E7C21E',
          //   '#DA3750',
          //   '#15eae7',
          //   '#8b9191',
          //   '#f7a90c',
          //   '#0495e2',
          //   '#a212ea',
          //   '#ea23d0',
          //   '#d281d3'
        
            
          // ],
          // label: {
          //   formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
          //   backgroundColor: '#F6F8FC',
          //   borderColor: '#8C8D8E',
          //   borderWidth: 1,
          //   borderRadius: 4,
          //   rich: {
          //     a: {
          //       color: '#6E7079',
          //       lineHeight: 22,
          //       align: 'center'
          //     },
          //     hr: {
          //       borderColor: '#8C8D8E',
          //       width: '100%',
          //       borderWidth: 1,
          //       height: 0
          //     },
          //     b: {
          //       color: '#4C5058',
          //       fontSize: 14,
          //       fontWeight: 'bold',
          //       lineHeight: 33
          //     },
          //     per: {
          //       color: '#fff',
          //       backgroundColor: '#4C5058',
          //       padding: [3, 4],
          //       borderRadius: 4
          //     }
          //   }
          // },
          data: this.OuterChartSeriesData
        }
      ]
    };
  }

}
