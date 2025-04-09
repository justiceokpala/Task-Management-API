import { IsNotEmpty } from "class-validator";
import { IsString } from "class-validator";

class DeleteTaskDto {
    @IsNotEmpty()
    @IsString()
    id: string;
  }

  export default DeleteTaskDto