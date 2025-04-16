import express, { Request, Response } from 'express';
import AppDataSource from "../data-source";
import taskRouter from './route/task_route';
import dotenv from 'dotenv';
import authRouter from './route/auth_route';



export function bootstrap() {
    const app = express();
    const port = 3000;
  
    app.use(express.json());
  
    app.get('/health', (req: Request, res: Response) => {
      res.status(200).send({ message: 'App is running' });
    });

    app.use('/api/tasks', taskRouter);
    app.use('/api/user', authRouter);

    async function initializeDatabase() {
      try {
        await AppDataSource.initialize();
        console.log('Database connection established');
      } catch (error) {
        console.error('Error establishing database connection:', error);
        process.exit(1); // Exit the process with a non-zero exit code
      }
    }
    dotenv.config();
    
    initializeDatabase();
   
  
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
}
  bootstrap();  
