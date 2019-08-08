import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { ModalService } from '@shared-services';
import { ProfileService } from '/@core-services';

import { ROSTER_TYPES } from '/@generated/fixtures';
import {
  Roster, User, Department, StaffDashboardData, Facility, StaffDashboardViewType, RosterShiftTime
} from '@models';

import { ScheduleModalComponent } from '../schedule-modal/schedule-modal.component';
import { BsModalRef } from '/ngx-bootstrap';
import { ChangeProfileDialogComponent } from 'src/app/core/components';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent {

  @ViewChild('table') public table: ElementRef;
  @Input() public facility: Facility;
  @Input() public facilities: Array<Facility>;
  @Input() public departments: Array<Department>;
  @Input() public set data(data: StaffDashboardData) {
    this.dataInput = data;
  }
  public get data(): StaffDashboardData {
    return this.dataInput;
  }
  @Input() public set view(view: StaffDashboardViewType) {
    this.viewInput = view;
  }
  public get view(): StaffDashboardViewType {
    return this.viewInput;
  }
  @Output() public detectChanges = new EventEmitter<null>();

  public roster: Roster;
  private modal: BsModalRef;
  private dataInput: StaffDashboardData;
  private kinds = ROSTER_TYPES;
  private viewInput: StaffDashboardViewType = 'users';

  constructor(
    private modalService: ModalService,
    private profileService: ProfileService,
  ) { }

  public departmentStyle(department: Department): object {
    if (department) {
      return {
        'background-color': department.color
      };
    }
  }

  public editRosterShift(date: string, user: User): void {
    const roster = this.data.rostersByUsers[user.id][date] || {} as Roster;
    const initialState = {
      date,
      roster,
      data: this.data,
      userId: user.id,
      view: this.view,
      facility: this.facility,
      facilities: this.facilities,
      departments: this.departments,
      sendRoster: this.receiveRoster.bind(this),
      removeRoster: this.removeRoster.bind(this),
    };
    this.modal = this.modalService.show(ScheduleModalComponent, {
      initialState,
      class: 'roster-modal',
    });
  }

  public editRosterUser(date: string, shiftTime: RosterShiftTime): void {
    const roster = this.data.rostersByShifts[shiftTime.id][date] || {} as Roster;
    const initialState = {
      date,
      roster,
      data: this.data,
      shiftTimeId: shiftTime.id,
      view: this.view,
      facility: this.facility,
      users: this.data.users,
      departments: this.departments,
      sendRoster: this.receiveRoster.bind(this),
      removeRoster: this.removeRoster.bind(this),
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
  }

  public removeRoster(roster: Roster): void {
    this.data.rostersByUsers[roster.userId][roster.date] = {};
    if (roster.kind === 'workday' && roster.facilityId === this.facility.id) {
      this.data.rostersByShifts[roster.shiftTimeId][roster.date] = {};
    }
  }

  public updateUser(userId: number): void {
    if (this.hasPermissions()) {
      const initialState = {
        userId,
        removeUser: this.removeUser.bind(this),
        changedUserList: this.changedUserList.bind(this),
      };
      this.modalService.show(ChangeProfileDialogComponent, {
        initialState,
        class: 'change-profile',
        keyboard: false,
        ignoreBackdropClick: true,
      });
    }
  }

  private removeUser(user: User): void {
    const findedUser = this.data.users.find(item => item.id === user.id);
    const indexOfFindedUser = this.data.users.indexOf(findedUser);
    this.data.users.splice(indexOfFindedUser, 1);
  }

  private changedUserList(user: User): void {
    const indexOfFindedUser = this.data.users.findIndex(item => {
      return item.id === user.id;
    });
    this.data.users[indexOfFindedUser] = Object.assign(this.data.users[indexOfFindedUser], user);
    this.detectChanges.emit(null);
  }

  public hasPermissions(): boolean {
    return this.profileService.hasPermissions('User:read');
  }

  public get permissions(): string | Array<string> {
    return this.roster ? 'Roster:update' : new Array('Roster:create', 'Roster:update');
  }

  public findUserBy(id: number): User {
    return this.data.users.find(user => user.id === id);
  }
}
