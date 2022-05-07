import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "load-panel",
  templateUrl: "./load-panel.component.html",
  styleUrls: ["./load-panel.component.scss"],
})
export class LoadPanelComponent implements OnInit {
  @Input() visibility: boolean;
  @Input() message: string;
  constructor() {}

  ngOnInit(): void {}
}
