import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class sendOtp {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  subject: string;
}

export default sendOtp;
