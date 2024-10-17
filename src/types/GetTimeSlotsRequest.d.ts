export interface IGetTimeSlotsRequest {
  start_day_identifier: string; // 요청 시작 날짜
  timezone_identifier: string; // TZ 식별자
  service_duration: number; // 서비스 제공 시간 (초 단위)
  days?: number; // 요청 시작 날짜부터 반환할 일수 (default: 1)
  timeslot_interval?: number; // 타임슬롯 간격 (초 단위, default: 1800)
  is_ignore_schedule?: boolean; // 해당 기간에 이미 존재하는 event 무시 여부 (default: false)
  is_ignore_workhour?: boolean; // 영업시간을 무시하고 하루 전체를 기간 설정할지 여부 (default: false)
}
