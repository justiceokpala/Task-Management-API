import AppDataSource from "../../data-source";
import Task from "../entity/task.entity";
import { Request, Response} from "express";
import { validate } from "class-validator";
import TaskDto from "./dto's/task_dto";
import GetTasksQueryDto from "./dto's/get_tasksdto";
import { plainToClass } from 'class-transformer';


const taskRepository = AppDataSource.getRepository(Task);

export const createTask = async (req: Request, res: Response): Promise<void> => {
    const taskDto = plainToClass(TaskDto, req.body) as TaskDto;;
    const errors = await validate(taskDto);
  
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }
  
    const task = taskRepository.create(taskDto);
    const savedTask = await taskRepository.save(task);
    res.status(201).json(savedTask);
  };
  

export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
    const query = plainToClass(GetTasksQueryDto, req.query) as GetTasksQueryDto;
    const errors = await validate(query);
  
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }
  
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
  

  