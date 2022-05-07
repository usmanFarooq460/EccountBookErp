import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-passwordreset",
  templateUrl: "./passwordreset.component.html",
  styleUrls: ["./passwordreset.component.scss"],
})

/**
 * Reset-password component
 */
export class PasswordresetComponent implements OnInit, AfterViewInit {
  resetForm: FormGroup;
  submitted = false;
  error = "";
  success = "";
  loading = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    document.body.removeAttribute("data-layout");
    document.body.classList.add("auth-body-bg");

    this.resetForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngAfterViewInit() {}

  // convenience getter for easy access to form fields
  get f() {
    return this.resetForm.controls;
  }

  /**
   * On submit form
   */
  onSubmit() {}
}
