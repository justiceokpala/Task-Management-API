import { IsString, IsNotEmpty, MinLength, IsEmail,  } from 'class-validator';

 class LogInDto {
 

  @IsEmail()
  email: string;
    
  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
  message: 
 'Password must be at least 8 characters long',
  })
  password: string;

}

export default LogInDto