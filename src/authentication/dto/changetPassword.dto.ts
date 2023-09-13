import { IsString, IsNotEmpty } from 'class-validator';

export class ChangePassword {

  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPasssword: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}

export default ChangePassword;
