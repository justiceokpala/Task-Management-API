import AppDataSource from "../../data-source";
import Task from "../entity/task.entity";
import { Request, Response} from "express";
import { validate } from "class-validator";
import TaskDto from "./dto's/task/taskDto";
import GetTasksQueryDto from "./dto's/task/getTasksDto";
import UpdateTaskDto from "./dto's/task/updateTaskDto";



const taskRepository = AppDataSource.getRepository(Task);

export const createTask = async (req: Request, res: Response): Promise<void> => {

  const taskDto =  req.body as unknown as TaskDto;
     const errors = await validate(taskDto);
     if (errors.length > 0) {
     res.status(400).json(errors);
       return;
     }
     const existingTask = await taskRepository.findOne({ where: { title: taskDto.title } }); 
      if (existingTask) {
      res.status(400).json({ message: 'Title taken, use another' });
   }
   
   try {
    const task = taskRepository.create(taskDto);
    const savedTask = await taskRepository.save(task);
    res.status(201).json(savedTask);  
   } catch (error) {
     console.log(error);
   }
  
  };
  

export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as GetTasksQueryDto
    const errors = await validate(query);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }
    console.log(query);
  
    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 10;
  
    try {
      const tasks = await taskRepository.find({
        skip: (page - 1) * limit,
        take: limit,
      });
      const totalCount = await taskRepository.count();
  
      res.status(200).json({
        tasks,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve tasks' });
    }
  };
  

  export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskId = req.query.id as string
      const task = await taskRepository.findOne({ where:{ id: taskId.toString()}});
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }
  
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve task' });
    }
  };
  
  
  export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskId = req.query.id as string
      const taskUpdateDto = req.body as unknown as UpdateTaskDto;
      const updateErrors = await validate(taskUpdateDto);
      if (updateErrors.length > 0) {
        res.status(400).json(updateErrors);
        return;
      }
      const task = await taskRepository.findOne({ where: { id: taskId.toString() } });
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }
      taskRepository.merge(task, taskUpdateDto);
      await taskRepository.save(task);
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update task' });
    }
  };


  export const deleteTask = async (req: Request, res: Response): Promise<void> =>  {
    try {
      const taskId = req.query.id as string
      const task = await taskRepository.findOne({ where: { id: taskId.toString() } });
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }
      await taskRepository.delete(taskId);
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete task' });
    }
  }
  
  