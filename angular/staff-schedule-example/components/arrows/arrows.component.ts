import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Period } from '@models';
import * as moment from 'moment';
import { DateFormat } from '@consts';

@Component({
  selector: 'app-arrows',
  templateUrl: './arrows.component.html',
  styleUrls: ['./arrows.component.scss']
})
export class ArrowsComponent {

  @Output() public dateRangeOutput = new EventEmitter<Period>();
  @Input() public dateRange: Period;

  public number: number;

  public onClickBF(): void {
    this.decreaseRange(this.duration);
    this.decreaseDate('startDate');
    this.decreaseDate('endDate');
    this.dateRangeOutput.emit(this.dateRange);
  }

  public onClickB(): void {
    this.decreaseRange(this.durationOfDay);
    this.dateRangeOutput.emit(this.dateRange);
  }

  public onClickF(): void {
    this.increaseRange(this.durationOfDay);
    this.dateRangeOutput.emit(this.dateRange);
  }

  public onClickFF(): void {
    this.increaseRange(this.duration);
    this.increaseDate('startDate');
    this.increaseDate('endDate');
    this.dateRangeOutput.emit(this.dateRange);
  }

  private get durationOfDay(): moment.Duration {
    return moment.duration(1, 'days');
  }

  private get duration(): moment.Duration {
    const startDate = moment(this.dateRange.startDate);
    const endDate = moment(this.dateRange.endDate);
    return moment.duration(endDate.diff(startDate));
  }

  private increaseDate(key: string): void {
    this.dateRange[key] = moment(this.dateRange[key])
      .add(this.durationOfDay, 'ms')
      .toString();
  }

  private decreaseDate(key: string): void {
    this.dateRange[key] = moment(this.dateRange[key])
      .subtract(this.durationOfDay, 'ms')
      .toString();
  }

  private increaseRange(duration: moment.Duration): void {
    this.dateRange.startDate = moment(this.dateRange.startDate)
      .add(duration, 'ms')
      .format(DateFormat)
      .toString();
    this.dateRange.endDate = moment(this.dateRange.endDate)
      .add(duration, 'ms')
      .format(DateFormat)
      .toString();
  }

  private decreaseRange(duration: moment.Duration): void {
    this.dateRange.startDate = moment(this.dateRange.startDate)
      .subtract(duration, 'ms')
      .format(DateFormat)
      .toString();
    this.dateRange.endDate = moment(this.dateRange.endDate)
      .subtract(duration, 'ms')
      .format(DateFormat)
      .toString();
  }
}
