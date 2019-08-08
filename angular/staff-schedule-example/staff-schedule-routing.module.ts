import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StaffSchedulePage } from './staff-schedules.page';

const routes: Routes = [
  {
    path: '',
    component: StaffSchedulePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffScheduleRoutingModule { }
