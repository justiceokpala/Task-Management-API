import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

 class VerifyVerificationCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}

export default VerifyVerificationCodeDto
