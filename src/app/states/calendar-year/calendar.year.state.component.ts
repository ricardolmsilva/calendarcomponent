import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {moment} from '../../../environments/environment';
import {CalendarUtilsService} from '../../services/calendar.utils.service';
import {IAnualCalendar, ICalendarMonthClicked, IDayYearViewClicked} from '../../components/calendar/calendar.component.interface';
import {ModalService} from '../../services/modal/modal.service';
import {DailyInfoYearModalComponent} from './daily-info-year-modal/daily-info-year-modal.component';
import {YearDraggableModalComponent} from './year-draggable-modal/year-draggable-modal.component';

@Component({
  selector: 'app-calendar-month-state',
  templateUrl: './calendar.year.state.component.html'
})
export class CalendarYearStateComponent implements OnInit {

  public activeYear: number;
  public anualCalendarData: IAnualCalendar<any>;
  public evtDayYearViewClicked: Array<IDayYearViewClicked<any>>;
  public evtDragYearViewClicked: Array<IDayYearViewClicked<any>>;

  constructor(
    private readonly _router: Router,
    private readonly _calendarUtilsService: CalendarUtilsService,
    private readonly _modalService: ModalService
  ) {
  }

  public ngOnInit(): void {
    if (!this.activeYear) {
      this.activeYear = moment().year();
    }

    this._calendarUtilsService.yearRequested = this.activeYear;
    this.anualCalendarData = this._calendarUtilsService.anualCalendar;
  }

  yearClicked(year: number, month: number): void {
    this._router.navigateByUrl(`/month-view/${year}/${month}`);
  }

  dateChanged(value: ICalendarMonthClicked): void {
    this.activeYear = value.year;
    this._calendarUtilsService.yearRequested = this.activeYear;
    this.anualCalendarData = this._calendarUtilsService.anualCalendar;
  }

  dayYearViewClicked(value: Array<IDayYearViewClicked<any>>): void {
    this.evtDayYearViewClicked = value;

    const instance = this._modalService.showVanilla(DailyInfoYearModalComponent, {
      modalSize: 'lg'
    });
    instance.componentInstance.evtDayYearViewClicked = value;
  }

  dragYearViewClicked(value: Array<IDayYearViewClicked<any>>): void {
    this.evtDragYearViewClicked = value;

    const instance = this._modalService.showVanilla(YearDraggableModalComponent, {
      modalSize: 'lg'
    });
    instance.componentInstance.evtDragYearViewClicked = value;
  }

}
