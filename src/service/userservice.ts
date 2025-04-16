import User from '../entity/user';
import { UserDto } from '../controller/dto\'s/user/userDto';
import * as bcrypt from 'bcrypt';
import AppDataSource from '../../data-source';
import LogInDto from '../controller/dto\'s/user/loginDto';
import VerifyVerificationCodeDto from '../controller/dto\'s/user/verifyVerificationCodeDto';
import jwt  from 'jsonwebtoken';
import * as nodemailer from 'nodemailer'
import { IsNull } from 'typeorm';



export class UserService {
    private userRepository = AppDataSource.getRepository(User);
  async SignUp(userDto: UserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user = this.userRepository.create({
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      email: userDto.email,
      passwordHash: hashedPassword,
      role: userDto.role || 'user',
    });
    return await this.userRepository.save(user);
  }

  async SignIn(logInDto: LogInDto): Promise<{ user: Partial<User>, token: string } | null> {
    const user = await this.validateUserCredentials(logInDto.email, logInDto.password);
    if (!user) return null;
    const { passwordHash, ...userWithoutPassword } = user;
    const token = jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET!, { expiresIn: '1h' });
    return { user: userWithoutPassword, token };
  }
  
  
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }


  async validateUserCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    return isValidPassword ? user : null;
  }


  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }


  async findUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({id});
  }

  async sendVerificationCode(user: User): Promise<void> {
    try {
      // Clear previous verification code and expiration time
      user.verificationCode = null;
      user.verificationCodeExpiresAt = null;
      user.isVerified = null;
  
      const VerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedVerificationCode = await bcrypt.hash(VerificationCode, 10);
      user.verificationCode = hashedVerificationCode;
      user.verificationCodeExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      await this.userRepository.save(user);
  
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT!),
        secure: process.env.EMAIL_SECURE === 'true',
        tls: {
          rejectUnauthorized: false,
        },
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Verify your email address',
        text: `Your verification code is: ${VerificationCode}`,
      };
  
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending verification code:', error);
    }
  }
    
    async verifyVerificationCode(verifyVerificationCodeDto: VerifyVerificationCodeDto): Promise<boolean> {
        try {
          const user = await this.userRepository.findOne({ where: { email: verifyVerificationCodeDto.email } }); 
          if (!user || !user.verificationCode || !user.verificationCodeExpiresAt) {
            throw new Error('User verification code or expiration date is missing');
          }
                 
        
      
          if (user.verificationCodeExpiresAt < new Date()) {
            throw new Error('Verification code has expired');
          }

          const isValid = await bcrypt.compare(verifyVerificationCodeDto.code, user.verificationCode);
          if (!isValid) {
            throw new Error('Invalid verification code');
          }
      
          user.isVerified = true;
          await this.userRepository.save(user);
          return true;
        } catch (error) {
          console.error('Error verifying verification code:', error);
          return false;
        }
      }
}     