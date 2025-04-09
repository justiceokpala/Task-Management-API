import AppDataSource from "../../data-source";
import Task from "../entity/task.entity";
import { Request, Response} from "express";
import { validate } from "class-validator";
import { plainToClass } from 'class-transformer';
import TaskDto from "./dto's/taskDto";
import GetTasksQueryDto from "./dto's/getTasksDto";
import GetTaskByIdDto from "./dto's/getTaskByIdDto";
import UpdateTaskDto from "./updateTaskDto";
import DeleteTaskDto from "./dto's/deleteTaskDto";


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
  

  export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = plainToClass(GetTaskByIdDto, req.query) as GetTaskByIdDto;
      const errors = await validate(query);
  
      if (errors.length > 0) {
        res.status(400).json(errors);
        return;
      }

      const task = await taskRepository.findOne({ where:{ id: query.id.toString()}});
    
  
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
      const query = plainToClass(GetTaskByIdDto, req.query) as GetTaskByIdDto;
      const errors = await validate(query);
      if (errors.length > 0) {
        res.status(400).json(errors);
        return;
      }
  
      const taskUpdateDto = plainToClass(UpdateTaskDto, req.body) as UpdateTaskDto;
      const updateErrors = await validate(taskUpdateDto);
      if (updateErrors.length > 0) {
        res.status(400).json(updateErrors);
        return;
      }
  
      const task = await taskRepository.findOne({ where: { id: query.id.toString() } });
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
    
      const deleteTaskDto = plainToClass(DeleteTaskDto, req.query) as DeleteTaskDto;
      const error = await validate(deleteTaskDto);
  
      if (error.length > 0) {
        res.status(400).json(error);
        return;
      }
  
      const task = await taskRepository.findOne({ where: { id: deleteTaskDto.id.toString() } });
  
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }
  
      await taskRepository.delete(deleteTaskDto.id.toString());
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete task' });
    }
  }
  
  