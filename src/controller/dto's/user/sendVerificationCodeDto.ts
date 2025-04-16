
import { IsEmail, IsNotEmpty } from "class-validator";
class SendVerificationCodeDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
  }

  export default SendVerificationCodeDto