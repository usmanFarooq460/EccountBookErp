import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { InvFoodProductionMainComponent } from "./inv-food-production-main/inv-food-production-main.component";

const routes: Routes = [{ path: "inv-food-porduction", component: InvFoodProductionMainComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvFoodProductionRoutingModule {}
