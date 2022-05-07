import { Component, OnInit, ViewChild } from "@angular/core";
import { DxFormComponent, DxHtmlEditorComponent } from "devextreme-angular";
import "devextreme/ui/html_editor/converters/markdown";
import { validate } from "src/app/shared/Base/validationHelper";
import { SmsTemplateService } from "./sms-template.service";

@Component({
  selector: "app-sms-template",
  templateUrl: "./sms-template.component.html",
  styles: [],
})
export class SmsTemplateComponent implements OnInit {
  @ViewChild("htmlEditor", { static: false })
  htmlEditor: DxHtmlEditorComponent;

  @ViewChild("smsForm", { static: false })
  smsForm: DxFormComponent;
  smsData: any;

  screenNameList = [];
  templateNameList = [];
  groupList = [];
  templateBody: any;
  templateText = "Dear! ";
  templateDataSource = [];
  id4Submit: number;

  constructor(private service: SmsTemplateService) {}

  ngOnInit(): void {
    this.getScreenName();
    this.initForm();

    this.setFields4Update();
  }

  initForm() {
    this.smsData = {
      ScreenName: "",
      GroupId: "",
    };
  }

  setFields4Update() {}

  getScreenName() {
    this.service.getScreenName({}).subscribe(
      (result) => (this.screenNameList = result),
      (error) => console.log(error)
    );
  }

  getMessageBody(screenName) {
    this.service.getMessageBody(screenName).subscribe(
      (result) => result && this.htmlEditor.writeValue(result),
      (error) => console.log(error)
    );
  }

  getParams(screenName) {
    this.templateDataSource = [];
    this.service.getParams({ ScreenId: screenName }).subscribe(
      (result) => {
        if (result && result.length >= 0) {
          result.map(({ smsParameterFeild }) => {
            this.templateDataSource.push({ text: smsParameterFeild });
          });
          this.htmlEditor.instance._refresh();
        }
      },
      (error) => console.log(error)
    );
  }

  getGroups(screenName) {
    this.service.getGroups({ ScreenName: screenName }).subscribe(
      (result) => (this.groupList = result),
      (error) => console.log(error)
    );
  }

  onScreenNameChange = ({ value }) => {
    this.htmlEditor.writeValue("");
    value && (this.getMessageBody(value), this.getParams(value), this.getGroups(value));
  };

  onSave() {
    // if (validate(this.smsForm)) {
    this.service.saveSMSBody({ Id: 0, SMSBody: this.htmlEditor.instance.option("value"), ScreenName: this.smsData.ScreenName, GroupId: this.smsData.GroupId }).subscribe(
      (result) => console.log(result),
      (error) => console.log(error)
    );
    // }
  }
}
