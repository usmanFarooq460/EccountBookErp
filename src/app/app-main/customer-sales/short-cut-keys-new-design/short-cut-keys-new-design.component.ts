import { Component, OnInit } from "@angular/core";

@Component({
  selector: "short-cut-keys-new-design",
  templateUrl: "./short-cut-keys-new-design.component.html",
  styleUrls: ["./short-cut-keys-new-design.component.scss"],
})
export class ShortCutKeysNewDesignComponent implements OnInit {
  isMenuOpened = false;
  showHideToolTip = false;
  constructor() {}

  ngOnInit(): void {}

  handleToolTipVisibility() {
    this.showHideToolTip = !this.showHideToolTip;
  }
}
