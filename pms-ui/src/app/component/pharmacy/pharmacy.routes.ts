import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { InventoryComponent } from './inventory/inventory-component';

const routes: Routes = [
  { path: '', redirectTo: 'inventory', pathMatch: 'full' },
  { path: 'inventory', component: InventoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmacyRoutingModule { }
