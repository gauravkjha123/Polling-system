import { IsString, IsNotEmpty } from 'class-validator';

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}

export default SendEmailDto;
