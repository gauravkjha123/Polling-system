import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ForgetPassword {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @IsNotEmpty()
  newPasssword: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}

export default ForgetPassword;
