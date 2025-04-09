import { IsNumberString, IsOptional } from 'class-validator';

 class GetTasksQueryDto {
  @IsOptional()
  @IsNumberString()
  page: string;

  @IsOptional()
  @IsNumberString()
  limit: string;
}

export default GetTasksQueryDto

