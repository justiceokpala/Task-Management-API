import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { IsEmail } from 'class-validator';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ nullable: true,type: 'text' })
  verificationCode: string | null;

  @Column({ nullable: true, type: 'timestamp'})
  verificationCodeExpiresAt: Date | null;

  @Column({ type: 'boolean', nullable: true })
  isVerified: boolean | null;

 
  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  role: string;
}

export default User
