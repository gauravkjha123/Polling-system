import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOptionDto {
  @IsString({ each: true })
  @IsNotEmpty()
  text: string;

  @IsNumber()
  @IsNotEmpty()
  questionId: number;
}

export default CreateOptionDto;
