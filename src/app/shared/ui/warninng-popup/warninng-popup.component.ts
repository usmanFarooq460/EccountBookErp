import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { ShortcutKeysService } from "src/app/shared/Base/shortcut-Keys.service";
import { take } from "rxjs/operators";
@Component({
  selector: "notification-popups",
  templateUrl: "./warninng-popup.component.html",
  styleUrls: ["./warninng-popup.component.scss"],
})
export class NotificationPopups implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Input() type: string;
  @Input() visibility: boolean;
  @Output() confirmed = new EventEmitter();
  @Output() okClicked = new EventEmitter();
  enterKeyCount = 9999;
  constructor(private keyboardShourtcuts: ShortcutKeysService) {
    this.keyboardShourtcuts
      .addShortcut({ keys: "control.enter" })
      .pipe(take(this.enterKeyCount))
      .subscribe((result) => {
        this.okClicked.emit("false");
      });
  }

  ngOnInit(): void {}
  onOk() {
    this.okClicked.emit("false");
  }

  onNoClicked() {
    this.confirmed.emit("false");
  }

  onYesClicked() {
    this.confirmed.emit("true");
  }
}
