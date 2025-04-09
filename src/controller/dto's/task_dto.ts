 import { IsString, IsNotEmpty,MinLength, MaxLength } from "class-validator";
 
 class TaskDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    @MinLength(3, { message: 'Title must be at least 3 characters long' })
    @MaxLength(100, { message: 'Title must be less than 100 characters long' })
    title: string;
    @IsString()
    @IsNotEmpty({ message: 'Description is required' })
    @MinLength(10, { message: 'Description must be at least 10 characters long' })
    @MaxLength(500, { message: 'Description must be less than 500 characters long' })
    description: string;
 }

 export default TaskDto