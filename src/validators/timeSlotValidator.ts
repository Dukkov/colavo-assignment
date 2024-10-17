import Joi from 'joi';

/**
 * 예약 가능한 타임 슬롯을 요청하기 위한 데이터의 유효성 검사를 수행하는 Joi 스키마입니다.
 * 각 필드에 대한 검증 규칙이 정의되어 있습니다.
 */
const getTimeSlotsSchema = Joi.object({
  start_day_identifier: Joi.string().required(),
  timezone_identifier: Joi.string().required(),
  service_duration: Joi.number().required(),
  days: Joi.number().default(1),
  timeslot_interval: Joi.number().default(1800),
  is_ignore_schedule: Joi.boolean().default(false),
  is_ignore_workhour: Joi.boolean().default(false)
});

export default getTimeSlotsSchema;
