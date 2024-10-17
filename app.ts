import express, { Application } from 'express';
import timeSlotRouter from './src/routes/timeSlotRoutes.js';

const app: Application = express();

app.use(express.json());
app.use('/getTimeSlots', timeSlotRouter);

app.listen(4000, '0.0.0.0', () => {
  console.log('Port 4000 ready');
});
