 import { IsOptional } from "class-validator";
 import { IsString } from "class-validator";
 
 class UpdateTaskDto {
    @IsOptional()
    @IsString()
    title?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  }

  export default UpdateTaskDto