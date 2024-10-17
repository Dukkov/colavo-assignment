export interface ITimeslot {
  begin_at: number; // 각 timeslot 시작 시각 (Unix timestamp)
  end_at: number; // 각 timeslot 종료 시각 (Unix timestamp)
}

export interface IEvent {
  created_at: number; // 예약 생성 시각 (Unix timestamp)
  updated_at: number; // 예약 최종 수정 시각 (Unix timestamp)
  begin_at: number; // 예약 시작 시각 (Unix timestamp)
  end_at: number; // 예약 종료 시각 (Unix timestamp)
}

export interface IWorkhour {
  is_day_off: boolean; // 살롱 휴무 여부
  open_interval: number; // 자정으로부터의 영업 시작 시각 (초 단위)
  close_interval: number; // 자정으로부터의 영업 종료 시각 (초 단위)
  weekday: Weekday; // 요일
}

export interface IDayTimetable {
  start_of_day: number; // timezone에 해당하는 날짜 시작 시각
  day_modifier: number; // 요청 날짜와 차이 일수
  is_day_off: boolean; // 살롱 휴무 여부
  timeslots: ITimeslot[];
}

export enum Weekday {
  Sun = 1,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat
}
