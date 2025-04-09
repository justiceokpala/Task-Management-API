import { IsNumber, IsString } from "class-validator";
import { IsNotEmpty } from "class-validator";

class GetTaskByIdDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}


export default GetTaskByIdDto