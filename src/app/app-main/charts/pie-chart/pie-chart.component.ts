import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';


@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  @Input() ChartTitle:string;
  @Input() ChartSubTitle: string;
  @Input() ChartLegendList:Array<string>;
  @Input() ChartSeriesName: string
  @Input() ChartSeriesData:Array<{value:number,name:string}>;
  @Output() OnChartClick=new EventEmitter();



  ChartOptions;
  constructor() {}

  ngOnInit() {
    console.log("Activating Pie Chart",this.ChartLegendList)
    this.SetChartData()
  }

  SetChartData()
  {
    this.ChartOptions={
      title: {
        text: this.ChartTitle,
        subtext: this.ChartSubTitle,
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        triggerOn:'mousemove',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        type:'scroll',
        top: 2,
        left: 'center',
        data: this.ChartLegendList
      },
      series: [
        {
          name: this.ChartSeriesName,
          selectedMode: 'single',
          type: 'pie',
          radius: '50%',
          data: this.ChartSeriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }
  onChartClick(e)
  {
    console.log(e);
    this.OnChartClick.emit(e.data)
  }

}
