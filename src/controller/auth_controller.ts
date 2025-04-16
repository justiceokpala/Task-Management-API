import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserService } from '../service/userservice';

const userService = new UserService();

export const signUp = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const userDto = req.body;
      const user = await userService.SignUp(userDto);
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error creating user' });
    }
  };

  export const signIn = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const logInDto = req.body;
      const result = await userService.SignIn(logInDto);
      if (!result) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      res.json({result});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error logging in' });
    }
  };

  export const sendVerificationCode = async (req: Request, res: Response): Promise<void> => {
    try {
        const SendVerificationCodeDto = req.body;
      const user = await userService.findUserByEmail(SendVerificationCodeDto.email);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      await userService.sendVerificationCode(user);
      res.json({ message: 'Verification code sent' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error sending verification code' });
    }
  };

  export const verifyVerificationCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const VerifyVerificationCodeDto = req.body;
      const user = await userService.findUserByEmail(VerifyVerificationCodeDto.email);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      const isValid = await userService.verifyVerificationCode(VerifyVerificationCodeDto);
      if (!isValid) {
        res.status(400).json({ message: 'Invalid verification code' });
        return;
      }
  
      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error verifying verification code' });
    }
  };
  
  
  
