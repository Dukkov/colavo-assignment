import moment from 'moment-timezone';
import { IEvent, IWorkhour, Weekday } from '../types/ScheduleTypes';

class SalonSchedule {
  private workhours: IWorkhour[];
  private events: IEvent[];

  constructor(workhours: IWorkhour[], events: IEvent[]) {
    this.workhours = workhours;
    this.events = events;
  }

  /**
   * 특정 요일의 영업시간을 반환합니다.
   * @param weekday - 1 (Sun)부터 7 (Sat)까지의 값
   * @returns 해당 요일의 영업시간 또는 null
   */
  public getWorkhoursByDay(weekday: Weekday): IWorkhour | null {
    return (
      this.workhours.find((workhour) => workhour.weekday === weekday) || null
    );
  }

  /**
   * 특정 날짜의 예약 상태를 반환합니다.
   * @param day - 'YYYYMMDD' 형식의 문자열
   * @param timezone - timezone_identifier
   * @returns 해당 날짜의 예약 상태 배열
   */
  public getEventsByDay(day: string, timezone: string): IEvent[] {
    // day 문자열을 연, 월, 일로 분리
    const year = parseInt(day.slice(0, 4), 10);
    const month = parseInt(day.slice(4, 6), 10) - 1;
    const date = parseInt(day.slice(6, 8), 10);

    // 해당 날짜의 시작 시각과 종료 시각을 타임존에 맞춰 계산
    const startOfDay = moment
      .tz({ year: year, month: month, day: date }, timezone)
      .startOf('day')
      .unix();
    const endOfDay = moment
      .tz({ year: year, month: month, day: date }, timezone)
      .endOf('day')
      .unix();

    // 해당 날짜에 시작되거나 종료되는 예약만 필터링
    return this.events.filter(
      (event) => event.begin_at < endOfDay && event.end_at > startOfDay
    );
  }
}

export default SalonSchedule;
