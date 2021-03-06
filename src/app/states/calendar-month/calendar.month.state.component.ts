import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {
  ICalendar, ICalendarDataSet,
  ICalendarLabel,
  ICalendarMonthClicked,
  IMonthlyCalendarDayClicked
} from '../../components/calendar/calendar.component.interface';
import {CalendarUtilsService} from '../../services/calendar.utils.service';
import {Location} from '@angular/common';
import {first} from 'rxjs/operators';
import {moment} from '../../../environments/environment';
import {ModalService} from '../../services/modal/modal.service';
import {MonthDraggableModalComponent} from './month-draggable-modal/month-draggable-modal.component';
import {DailyInfoModalComponent} from './daily-info-modal/daily-info-modal.component';

@Component({
  selector: 'app-calendar-month-state',
  templateUrl: './calendar.month.state.component.html'
})
export class CalendarMonthStateComponent implements OnInit {
  public activeYear: number;
  public activeMonth: number;
  public monthlyCalendarData: ICalendar<any>;
  public detailsBarLabels: Array<ICalendarLabel>;
  public dataSets: ICalendarDataSet;
  public evtDraggable: IMonthlyCalendarDayClicked<any>;
  public evtMonthlyCalendarDay: IMonthlyCalendarDayClicked<any>;

  constructor(
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _calendarUtilsService: CalendarUtilsService,
    private readonly _location: Location,
    private readonly _modalService: ModalService
  ) {
  }

  public ngOnInit(): void {
    this._activatedRoute.paramMap
      .pipe(first())
      .subscribe((params: ParamMap) => {
        this.activeMonth = +params.get('month');
        this.activeYear = +params.get('year');
      });

    if (this.activeMonth === 0) {
      this.activeMonth = moment().month() + 1;
    }

    if (this.activeYear === 0) {
      this.activeYear = moment().year();
    }

    this.monthlyCalendarData = this._calendarUtilsService.montlhyCalendar;
    this.detailsBarLabels = this._calendarUtilsService.labelsAvailables;
    this.dataSets = this._calendarUtilsService.dataSets;

    this._location.replaceState(`/month-view/${this.activeYear}/${this.activeMonth}`);

    // ======================================
    // código quando utilizava o calendar.utils.service.ts
    //
    // this._calendarUtilsService.monthRequested = this.activeMonth;
    // this._calendarUtilsService.yearRequested = this.activeYear;
    // this.monthlyCalendarData = this._calendarUtilsService.montlhyCalendar;
    // this.detailsBarLabels = this._calendarUtilsService.labelsAvailables;
    // ======================================


  }

  public dateChanged(value: ICalendarMonthClicked): void {

    this.monthlyCalendarData = this._calendarUtilsService.montlhyCalendar;
    this.detailsBarLabels = this._calendarUtilsService.labelsAvailables;

    this.activeYear = value.year;
    this.activeMonth = value.month;
    this._location.replaceState(`/month-view/${this.activeYear}/${this.activeMonth}`);

    // ======================================
    // código quando utilizava o calendar.utils.service.ts
    //
    //
    // this._calendarUtilsService.monthRequested = this.activeMonth;
    // this._calendarUtilsService.yearRequested = this.activeYear;
    // this.monthlyCalendarData = this._calendarUtilsService.montlhyCalendar;
    //
    // ===========================

  }

  public evtDraggableClicked(value: IMonthlyCalendarDayClicked<any>): void {
    this.evtDraggable = value;
    const instance = this._modalService.showVanilla(MonthDraggableModalComponent, {
      modalSize: 'lg'
    });
    instance.componentInstance.evtDraggable = this.evtDraggable;
  }

  public evtMonthlyCalendarDayClicked(value: IMonthlyCalendarDayClicked<any>): void {
    this.evtMonthlyCalendarDay = value;
    const instance = this._modalService.showVanilla(DailyInfoModalComponent, {
      modalSize: 'lg'
    });
    instance.componentInstance.evtMonthlyCalendarDay = this.evtMonthlyCalendarDay;
  }
}
