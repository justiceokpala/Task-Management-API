
import express, { Router } from 'express';
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from '../controller/task_controller';

const taskRouter: Router = express.Router();

taskRouter.post('/createTask', createTask);
taskRouter.get('/getAllTasks', getAllTasks);
taskRouter.get('/getTask', getTaskById);
taskRouter.patch('/updateTask', updateTask);
taskRouter.delete('/deleteTask', deleteTask);

export default taskRouter;