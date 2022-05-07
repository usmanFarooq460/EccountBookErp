import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
@Component({
  selector: "global-buttons",
  templateUrl: "./global-buttons.component.html",
  styleUrls: ["./global-buttons.component.scss"],
})
export class GlobalButtonsComponent implements OnInit {
  @Input() buttonType: string;
  @Input() icon: string;
  @Input() title: string;
  @Input() paramsId: number;
  @Input() link: string;
  @Input() color: string;
  @Input() loadIndicatorVisible: boolean;
  @Output() onClick = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  onButtonClick() {
    this.onClick.emit(1);
  }
}
