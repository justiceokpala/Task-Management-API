
import express, { Router } from 'express';
import { createTask, getAllTasks } from '../controller/task_controller';

const taskRouter: Router = express.Router();

taskRouter.post('/createTask', createTask);
taskRouter.get('/getAllTasks', getAllTasks);

export default taskRouter;