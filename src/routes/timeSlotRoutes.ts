import express from 'express';
import timeSlotController from '../controllers/timeSlotController.js';

const timeSlotRouter = express.Router();

timeSlotRouter.post('/', timeSlotController); // POST /getTimeSlots 라우팅

export default timeSlotRouter;
