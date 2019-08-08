import { Component, ViewChild, OnInit } from '@angular/core';
import {
  DashboardService, FacilityService, ProfileService, DepartmentService
} from '@core-services';
import { ModalService } from '@shared-services';
import { SvgIconRegistryService } from 'angular-svg-icon';

import * as Routes from '@generated/routes';
import * as moment from 'moment';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import {
  Facility,
  Period,
  Roster,
  StaffDashboardData,
  Profile,
  Department,
  StaffDashboardViewType
} from '@models';
import { MS_IN_WEEK } from '@consts';

import {
  ChangeProfileDialogComponent
} from 'src/app/components/change-profile-dialog/change-profile-dialog.component';
import { ScheduleModalComponent } from '../schedule-modal/schedule-modal.component';
import { ScheduleComponent } from '../schedule/schedule.component';
import { RangeDatePickerComponent } from 'src/app/shared/components';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-dashboard-wrapper',
  templateUrl: './dashboard-wrapper.component.html',
  styleUrls: ['./dashboard-wrapper.component.scss'],
})
export class ScheduleWrapperComponent implements OnInit {

  @ViewChild(ScheduleModalComponent) private send: ScheduleModalComponent;
  @ViewChild(ScheduleModalComponent) private delete: ScheduleModalComponent;
  @ViewChild(RangeDatePickerComponent) private datepicker: RangeDatePickerComponent;
  @ViewChild(ScheduleComponent) public dashboard: ScheduleComponent;

  public data: StaffDashboardData = null;
  public view: StaffDashboardViewType = 'users';
  public startDate = new Date(new Date().getTime() - MS_IN_WEEK).toString();
  public endDate = new Date().toString();
  public residentName: string;
  public facilityId: number;
  public paramCSV = {
    start_date: this.startDate,
    end_date: this.endDate,
    facility_id: null,
    search: this.residentName,
    view: this.view,
    format: 'csv'
  };
  public filteredResidentName = new Subject<string>();
  public facilities: Array<Facility>;
  public departments: Array<Department>;
  public currentUser: Profile;
  public date: string;
  public userId: number;
  public roster = {} as Roster;
  private modal: BsModalRef;
  public facility: Facility;

  constructor(
    private dasboardService: DashboardService,
    private facilityService: FacilityService,
    private svgService: SvgIconRegistryService,
    private modalService: ModalService,
    private profileService: ProfileService,
    private departmentService: DepartmentService
  ) {
    this.getCurrentUser();
    this.svgService.loadSvg(`assets/icons/breadcrumb-icon.svg`, 'bc-arrow');
    this.getFacilities();
    this.getDepartments();
    this.filteredResidentName.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(name => {
      this.residentName = name;
      this.refreshDashboardData();
      this.dashboard.table.nativeElement.scrollTop = 0;
    });
  }

  ngOnInit() {
    this.updateDateRange({startDate: this.startDate, endDate: this.endDate});
  }

  public setView(value: StaffDashboardViewType): void {
    this.view = value;
    this.paramCSV.view = value;
  }

  public sendData(): void {
    this.send.sendData();
  }

  private getCurrentUser(): void {
    this.profileService.profile.subscribe(user => this.currentUser = user);
  }

  private getFacilities(): void {
    this.facilityService.getFacilities().subscribe(facilities => {
      this.facilities = facilities;
      this.facility = facilities[0];
      this.facilityId = this.facility && this.facility.id;
      this.refreshDashboardData();
    });
  }

  private getDepartments(): void {
    this.departmentService.getDepartments().subscribe(departments => {
      this.departments = departments;
    });
  }

  public get csvLink(): string {
    return Routes.rostersPath(this.paramCSV);
  }

  public updateDateRange(event: Period): void {
    this.datepicker.dateRange.next(event);
  }

  public receiveDateRange(event: {startDate: Date, endDate: Date}): void {
    this.paramCSV.start_date = this.startDate = this.formatDate(event.startDate);
    this.paramCSV.end_date = this.endDate = this.formatDate(event.endDate);
    this.paramCSV.end_date = this.endDate;
    this.refreshDashboardData();
  }

  public get dateRange(): Period {
    return {
      startDate: this.startDate,
      endDate: this.endDate
    };
  }

  private formatDate(date: Date): string {
    return moment(date).format('YYYY-MM-DD');
  }

  public filterResidentsByName(filterString: string): void {
    this.residentName = this.paramCSV.search = filterString;
    this.filteredResidentName.next(filterString);
  }

  public refreshDashboardData(): void {
    this.dasboardService.getStaffDashboard(
      this.startDate,
      this.endDate,
      this.residentName,
      this.facilityId,
    ).subscribe(staffDashboardData => {
      this.data = staffDashboardData;
      this.startDate = this.data.startDate;
      this.endDate = this.data.endDate;
    });
  }

  public changeFacility(): void {
    this.paramCSV.facility_id = this.facilityId;
    this.facility = this.facilities.find(facility => facility.id === +this.facilityId);
    this.refreshDashboardData();
  }

  public addNewStaffMember(): void {
    const initialState = {
      user: {},
      changedUserList: this.refreshDashboardData.bind(this),
      removeUser: this.refreshDashboardData.bind(this)
    };
    this.modalService.show(ChangeProfileDialogComponent, {
      initialState,
      class: 'change-profile',
      keyboard: false,
      ignoreBackdropClick: true,
    });
  }

  public addNewRoster(): void {
    const initialState = {
      data: this.data,
      roster: this.roster,
      facility: this.facility,
      departments: this.departments,
      facilities: this.facilities,
      users: this.data.users,
      sendRoster: this.receiveRoster.bind(this),
    };
    this.modal = this.modalService.show(ScheduleModalComponent, {
      initialState,
      class: 'roster-modal',
    });
  }

  public receiveRoster(roster: Roster): void {
    this.data.rostersByUsers[roster.userId][roster.date] = roster;
    if (roster.kind === 'workday' && roster.facilityId === this.facility.id) {
      this.data.rostersByShifts[roster.shiftTimeId][roster.date] = roster;
    } else {
      this.data.rostersByShifts[roster.shiftTimeId][roster.date] = {};
    }
    this.modal.hide();
  }
}
