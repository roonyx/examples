import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StaffScheduleRoutingModule } from './staff-schedule-routing.module';
import { StaffSchedulePage } from './staff-schedule.page';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  ScheduleModalComponent,
  ScheduleComponent,
  ScheduleWrapperComponent,
  ArrowsComponent,
} from './components';

@NgModule({
  declarations: [
    StaffSchedulePage,
    ScheduleModalComponent,
    ScheduleComponent,
    ScheduleWrapperComponent,
    ArrowsComponent,
  ],
  imports: [
    RouterModule,
    StaffScheduleRoutingModule,
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    ScheduleModalComponent,
  ]
})
export class StaffScheduleModule { }
