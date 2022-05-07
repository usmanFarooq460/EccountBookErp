import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-food-production-history",
  templateUrl: "./food-production-history.component.html",
  styles: [],
})
export class FoodProductionHistoryComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  gotoFoodProductionForm() {
    this.router.navigate(["/production/food-production-form"]);
  }
}
