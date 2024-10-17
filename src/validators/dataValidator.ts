import { IEvent, IWorkhour } from '../types/ScheduleTypes';

/**
 * 예약 목록에서 유효하지 않은 예약을 필터링합니다.
 * @param events - IEvent 타입의 예약 목록
 * @returns 필터링된 예약 목록
 */
export const validateEvents = (events: IEvent[]): IEvent[] => {
  return events.filter((event) => {
    // 예약의 시작 시각이 종료 시각보다 늦는 경우 유효하지 않은 예약으로 간주합니다.
    if (event.begin_at > event.end_at) return false;

    return true;
  });
};

/**
 * 영업시간 배열에서 유효하지 않은 영업시간을 필터링합니다.
 * @param workhours - IWorkhour 타입의 영업시간 배열
 * @returns 유효한 영업시간 배열
 */
export const validateWorkhours = (workhours: IWorkhour[]): IWorkhour[] => {
  return workhours.filter((workhour) => {
    // 영업 시작 시간이 종료 시간보다 늦거나 같다면 해당 영업시간은 유효하지 않은것으로 간주합니다.
    if (workhour.open_interval >= workhour.close_interval) return false;

    return true;
  });
};
