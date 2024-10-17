# COLAVO 백엔드 과제

해당 repository는 COLAVO 백엔드 과제 제출을 위해 만들어졌습니다.  
서버는 요청에 따라 예약 가능한 timeslot을 반환하는 API를 제공합니다.

## 주요 기능
- **timeslot 생성**: 영업 시간, 예약 이벤트, 요구 사항 등을 고려하여 예약 가능한 타임 슬롯을 생성합니다.
- **timezone 지원**: 다양한 timezone 요청에 따른 응답을 반환합니다.

## 사전 준비 사항
- **Node.js**: v16 이상
- **TypeScript**: v4.0 이상

## 서버 실행 방법

타입스크립트 파일 컴파일 및 서버 실행 명령어는 다음과 같습니다:

```sh
npm run build
npm start
```

이 명령어는 `build` 디렉터리에 있는 컴파일된 JavaScript 파일을 사용하여 서버를 실행합니다.

## 테스트 실행 방법

이 프로젝트는 Jest를 테스트 프레임워크로 사용합니다.

테스트 실행 명령어:
   ```sh
   npm test
   ```

## API 문서

### 예약 가능한 타임 슬롯 조회

**엔드포인트**: `/getTimeSlots`

**메서드**: `POST`

**Request body**:
```json
{
  "start_day_identifier": "YYYYMMDD",
  "days": 1,
  "service_duration": 3600,
  "timeslot_interval": 1800,
  "is_ignore_schedule": false,
  "is_ignore_workhour": false,
  "timezone_identifier": "Asia/Seoul"
}
```

**Response**:
- 각 요청된 날짜에 대한 예약 가능한 타임 슬롯 목록을 반환합니다.

## 프로젝트 구조
- **/app.ts**: 애플리케이션 엔트리 포인트입니다.
- **src/routes**: 라우터를 포함합니다.
- **src/controllers**: 요청을 다루는 컨트롤러를 포함합니다.
- **src/models**: `SalonSchedule` 등 스케줄 관련 작업을 관리하는 모델을 포함합니다.
- **src/services**: `timeSlotService`와 같은 핵심 비즈니스 로직을 포함합니다.
- **src/tests**: 서비스와 기능을 테스트하는 테스트 파일을 포함합니다.
- **src/utils**: JSON 파서와 같은 유틸리티 함수들을 포함합니다.
- **src/validators**: 예약 및 영업 시간과 같은 입력 데이터를 검증합니다.

## 추가 사항
- 이 프로젝트는 **ESM (ECMAScript Module)** 표준을 따릅니다.

