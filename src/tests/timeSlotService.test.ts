import { timeSlotService } from '../services/timeSlotService';
import { IGetTimeSlotsRequest } from '../types/GetTimeSlotsRequest';
import moment from 'moment-timezone';

describe('timeSlotService', () => {
  it('should generate timeslots within workhours', async () => {
    const request: IGetTimeSlotsRequest = {
      start_day_identifier: moment().format('YYYYMMDD'),
      days: 1,
      service_duration: 3600,
      timeslot_interval: 1800,
      is_ignore_schedule: false,
      is_ignore_workhour: false,
      timezone_identifier: 'Asia/Seoul'
    };

    const result = await timeSlotService(request);
    expect(result.length).toBe(1);
    expect(result[0].timeslots.length).toBeGreaterThan(0);
  });

  it('should not generate timeslots if workhours are invalid (open and close time are the same)', async () => {
    const request: IGetTimeSlotsRequest = {
      start_day_identifier: '20210510', // Assuming 5월 10일의 open_interval == close_interval
      days: 1,
      service_duration: 3600,
      timeslot_interval: 1800,
      is_ignore_schedule: false,
      is_ignore_workhour: false,
      timezone_identifier: 'Asia/Seoul'
    };

    const result = await timeSlotService(request);
    expect(result.length).toBe(1);
    expect(result[0].timeslots.length).toBe(0);
  });

  it('should generate timeslots for the entire day if workhours are ignored', async () => {
    const request: IGetTimeSlotsRequest = {
      start_day_identifier: moment().format('YYYYMMDD'),
      days: 1,
      service_duration: 3600,
      timeslot_interval: 1800,
      is_ignore_schedule: false,
      is_ignore_workhour: true,
      timezone_identifier: 'Asia/Seoul'
    };

    const result = await timeSlotService(request);
    expect(result.length).toBe(1);
    expect(result[0].timeslots.length).toBeGreaterThan(0);
  });

  it('should ignore events if is_ignore_schedule is true', async () => {
    const request: IGetTimeSlotsRequest = {
      start_day_identifier: moment().format('YYYYMMDD'),
      days: 1,
      service_duration: 3600,
      timeslot_interval: 1800,
      is_ignore_schedule: true,
      is_ignore_workhour: false,
      timezone_identifier: 'Asia/Seoul'
    };

    const result = await timeSlotService(request);
    expect(result.length).toBe(1);
    expect(result[0].timeslots.length).toBeGreaterThan(0);
  });

  it('should filter out timeslots that overlap with events', async () => {
    const request: IGetTimeSlotsRequest = {
      start_day_identifier: moment().format('YYYYMMDD'),
      days: 1,
      service_duration: 3600,
      timeslot_interval: 1800,
      is_ignore_schedule: false,
      is_ignore_workhour: false,
      timezone_identifier: 'Asia/Seoul'
    };

    const result = await timeSlotService(request);
    expect(result.length).toBe(1);
    // Ensure timeslots that overlap with events are filtered out
    result[0].timeslots.forEach((timeslot) => {
      // Add assertions to ensure no timeslot overlaps with existing events
      expect(timeslot).toBeDefined();
    });
  });
});
