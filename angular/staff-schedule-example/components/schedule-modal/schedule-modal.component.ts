import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { RosterService, ProfileService } from '@core-services';
import { ToastrService, ModalService } from '@shared-services';

import {
  Facility,
  Roster,
  Errors,
  User,
  RosterShiftTime,
  StaffDashboardViewType,
  Department,
  StaffDashboardData
} from '@models';
import { createErrorMessage, showConfirmDirtyForm, DATAPICKER_CONFIG } from '@helpers';
import { ROSTER_TYPES } from '@generated/fixtures';

import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-schedule-modal',
  templateUrl: './schedule-modal.component.html',
  styleUrls: ['./schedule-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleModalComponent implements OnInit {

  public sendRoster: (roster: Roster) => void;
  public removeRoster: (roster: Roster) => void;
  public view: StaffDashboardViewType = null;
  public facility: Facility;
  public departments: Array<Department>;
  public date: string;
  public userId: number;
  public shiftTimeId: number;
  public roster: Roster;
  public users: Array<User>;
  public form: FormGroup;
  public errors: Errors = {};
  public bsConfig = DATAPICKER_CONFIG;
  public facilities: Array<Facility>;
  public rosterTypes = ROSTER_TYPES;
  public shifts: Array<RosterShiftTime>;
  public data: StaffDashboardData;

  constructor(
    private fb: FormBuilder,
    private rosterService: RosterService,
    private cdr: ChangeDetectorRef,
    private profileService: ProfileService,
    private toastr: ToastrService,
    protected modalService: ModalService,
    protected modalRef: BsModalRef
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      id: [this.roster.id],
      date: [this.roster.date || this.date || new Date()],
      kind: [this.roster.kind || 'workday'],
      facilityId: [this.roster.facilityId || this.facility && this.facility.id],
      userId: [this.roster.userId || this.userId],
      shiftTimeId: [this.roster.shiftTimeId || this.shiftTimeId],
    });
  }

  public sendData(): void {
    !!this.roster.id ? this.updateRoster() : this.createRoster();
  }

  private createRoster(): void {
    if (!this.date && !this.userId) {
      this.roster = this.form.value;
      this.roster.date = moment(this.form.get('date').value).format('DD/MM/YYYY');
    }
    this.rosterService.createRoster(this.form.value).subscribe(
      (roster: Roster) => {
        this.errors = {};
        this.toastr.show('Roster added', 'Roster', 'success');
        this.sendRoster(roster);
        this.closeModal();
      },
      (err) => {
        this.toastr.show(createErrorMessage(err), 'Saving error', 'error');
        this.errors = err;
        this.cdr.detectChanges();
      }
    );
  }

  private updateRoster(): void {
    this.rosterService.updateRoster(this.roster.id, this.form.value).subscribe(
      (roster: Roster) => {
        this.errors = {};
        this.toastr.show('Roster updated', 'Roster', 'success');
        this.sendRoster(roster);
        this.closeModal();
      },
      (err) => {
        this.toastr.show(createErrorMessage(err), 'Saving error', 'error');
        this.errors = err;
        this.cdr.detectChanges();
      }
    );
  }

  public removeConfirm(roster: Roster): void {
    const initialState = {
      confirm: this.deleteRoster.bind(this, roster),
      text: 'Are you sure you want to delete this roster?'
    };
    showConfirmDirtyForm(true, this.modalService, initialState);
  }

  public deleteRoster(): void {
    this.rosterService.removeRoster(this.roster.id).subscribe(
      () => {
        this.errors = {};
        this.toastr.show('Roster removed', 'Roster details', 'success');
        this.removeRoster(this.roster);
        this.closeModal();
      },
      (err) => {
        this.toastr.show('An error occured', 'Roster details', 'error');
        this.errors = err;
        this.cdr.detectChanges();
      }
    );
  }

  public closeModal(): void {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  public isDisabled(): boolean {
    return !(this.profileService.hasPermissions(this.permission));
  }

  public get permission(): string {
    return this.roster.id && 'Roster:update' || 'Roster:create';
  }

  public extractDate(): string {
    const date = this.form.get('date').value;
    if (date) {
      return date;
    }
  }

  public isUserAvailable(user: User): boolean {
    const facilityId = this.form.get('facilityId').value;
    if (this.facility && this.facility.id !== facilityId) {
      return true;
    }
    const roster = this.data.rostersByUsers[user.id][this.extractDate()];
    return !roster || !roster.id;
  }

  public isShiftAvailable(shift: RosterShiftTime): boolean {
    const facilityId = this.form.get('facilityId').value;
    if (this.facility && this.facility.id !== facilityId) {
      return true;
    }
    const roster = this.data.rostersByShifts[shift.id][this.extractDate()];
    return !roster || !roster.id;
  }
}
