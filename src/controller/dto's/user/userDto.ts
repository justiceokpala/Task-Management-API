import { IsString, IsNotEmpty, MinLength, IsEmail,  } from 'class-validator';
import { Column, } from 'typeorm';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;
    
  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
  message: 
 'Password must be at least 8 characters long',
  })
  password: string;
  
  @IsString()
  role?: string;
}