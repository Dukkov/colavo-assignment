import path from 'path';
import moment from 'moment-timezone';
import { IGetTimeSlotsRequest } from '../types/GetTimeSlotsRequest';
import {
  IDayTimetable,
  IEvent,
  IWorkhour,
  ITimeslot,
  Weekday
} from '../types/ScheduleTypes';
import SalonSchedule from '../models/SalonSchedule.js';
import { parseJsonFile } from '../utils/jsonParser.js';
import { getDirname } from '../utils/getDirname.js';
import {
  validateEvents,
  validateWorkhours
} from '../validators/dataValidator.js';

/**
 * timeslot을 생성하는 함수
 * @param dayStart - 해당 날짜의 시작을 나타내는 moment 객체
 * @param openInterval - 영업 시작 시간 (초 단위)
 * @param closeInterval - 영업 종료 시간 (초 단위)
 * @param serviceDuration - 서비스 지속 시간 (초 단위)
 * @param timeslotInterval - 타임슬롯 간격 (초 단위)
 * @param events - 해당 날짜의 예약 목록
 * @param timezone - 요청의 타임존
 * @returns 예약 가능한 timeslot 배열
 */
const generateAvailableTimeslots = (
  dayStart: moment.Moment,
  openInterval: number,
  closeInterval: number,
  serviceDuration: number,
  timeslotInterval: number,
  events: IEvent[],
  timezone: string
): ITimeslot[] => {
  const timeslots: ITimeslot[] = [];

  // 영업 시작, 종료 시각 설정
  const openTime = dayStart.clone().add(openInterval, 'seconds');
  const closeTime = dayStart.clone().add(closeInterval, 'seconds');

  // 시각을 timeslotInterval 만큼 증가시키며, 영업 종료 시각까지 반복해서 timeslot 생성
  for (
    let currentTime = openTime.clone();
    currentTime
      .clone()
      .add(serviceDuration, 'seconds')
      .isSameOrBefore(closeTime);
    currentTime.add(timeslotInterval, 'seconds')
  ) {
    const slotEnd = currentTime.clone().add(serviceDuration, 'seconds');

    // 현재 timeslot이 기존 예약과 겹치는지 확인
    const isOverlapping = events.some((event) => {
      const eventStart = moment.unix(event.begin_at).tz(timezone);
      const eventEnd = moment.unix(event.end_at).tz(timezone);
      return currentTime.isBefore(eventEnd) && slotEnd.isAfter(eventStart);
    });

    // 현재 timeslot이 기존 예약과 겹치지 않는 경우 예약 가능한 timeslot으로 추가
    if (!isOverlapping) {
      timeslots.push({
        begin_at: currentTime.unix(),
        end_at: slotEnd.unix()
      });
    }
  }

  return timeslots;
};

/**
 * DayTimetable을 생성하는 서비스 함수입니다.
 * @param requestBody - 요청 정보를 담은 객체
 * @returns 선택된 기간에 예약 가능한 시간을 포함한 DayTimetable 배열
 */
export const timeSlotService = async (
  requestBody: IGetTimeSlotsRequest
): Promise<IDayTimetable[]> => {
  const {
    start_day_identifier,
    days = 1,
    is_ignore_schedule = false,
    is_ignore_workhour = false,
    service_duration,
    timeslot_interval = 1800,
    timezone_identifier
  } = requestBody;

  try {
    // 현재 모듈의 디렉토리 경로를 가져옴
    const __dirname = getDirname(import.meta.url);

    // 영업시간 및 예약 목록을 json 파일에서 파싱함
    const rawWorkhours = await parseJsonFile<IWorkhour[]>(
      path.join(__dirname, '../database/workhours.json')
    );
    const rawEvents = await parseJsonFile<IEvent[]>(
      path.join(__dirname, '../database/events.json')
    );

    // 유효하지 않은 영업시간과 예약 목록을 필터링함
    const workhours = validateWorkhours(rawWorkhours);
    const events = validateEvents(rawEvents);

    // SalonSchedule 인스턴스 생성
    const salonSchedule = new SalonSchedule(workhours, events);
    const dayTimetables: IDayTimetable[] = [];

    // 요청된 날짜 수 만큼 반복하며 각 날짜의 DayTimetable 생성
    for (let i = 0; i < days; i++) {
      const currentDayMoment = moment
        .tz(start_day_identifier, 'YYYYMMDD', timezone_identifier)
        .add(i, 'days');
      const dayIdentifier = currentDayMoment.format('YYYYMMDD');
      const weekday = ((currentDayMoment.isoWeekday() % 7) + 1) as Weekday;

      // 해당 날짜의 영업시간을 가져옴
      const workhour = salonSchedule.getWorkhoursByDay(weekday);
      const isDayOff =
        !is_ignore_workhour && workhour ? workhour.is_day_off : false;

      // 해당 날짜의 예약 목록을 가져옴
      const eventsOfDay = is_ignore_schedule
        ? []
        : salonSchedule.getEventsByDay(dayIdentifier, timezone_identifier);

      let availableTimeslots: ITimeslot[] = [];

      // 영업시간을 무시하지 않는 경우, 영업시간 내에서 timeslot 생성
      if (!is_ignore_workhour && workhour && !isDayOff) {
        availableTimeslots = generateAvailableTimeslots(
          currentDayMoment,
          workhour.open_interval,
          workhour.close_interval,
          service_duration,
          timeslot_interval,
          eventsOfDay,
          timezone_identifier
        );
      } else if (is_ignore_workhour) {
        // 영업시간을 무시하는 경우, 하루 전체를 기간으로 하여 timeslot 생성
        availableTimeslots = generateAvailableTimeslots(
          currentDayMoment,
          0,
          86400,
          service_duration,
          timeslot_interval,
          eventsOfDay,
          timezone_identifier
        );
      }

      // 해당 날짜의 DayTimetable 추가
      dayTimetables.push({
        start_of_day: currentDayMoment.startOf('day').unix(),
        day_modifier: i,
        is_day_off: isDayOff,
        timeslots: availableTimeslots
      });
    }

    return dayTimetables;
  } catch (err) {
    console.error('Error occurred in timeSlotService:', err);
    throw err;
  }
};
