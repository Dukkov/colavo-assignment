import { Request, Response } from 'express';
import { IDayTimetable } from '../types/ScheduleTypes';
import { IGetTimeSlotsRequest } from '../types/GetTimeSlotsRequest';
import getTimeSlotsSchema from '../validators/timeSlotValidator.js';
import { timeSlotService } from '../services/timeSlotService.js';

// POST /getTimeSlots 요청을 처리하는 controller
const timeSlotController = async (req: Request, res: Response) => {
  try {
    // Request body 유효성 검증
    const requestBody: IGetTimeSlotsRequest =
      await getTimeSlotsSchema.validateAsync(req.body);

    // timeSlotService 함수를 호출해서 예약 가능한 timeslot 생성
    const result: IDayTimetable[] = await timeSlotService(requestBody);

    // timeslot 생성에 성공한 경우 200 코드와 DayTimetable 반환
    res.status(200).json(result);
  } catch (err) {
    // Request body 유효성 검증 오류 처리
    if (err.isJoi) {
      console.error(
        'Error occured in timeSlotController: Invalid request data received'
      );
      res.status(400).json({ message: 'Bad request' });
    } else {
      // 기타 내부 오류 처리
      console.error('Error occured in timeSlotController: ', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export default timeSlotController;
