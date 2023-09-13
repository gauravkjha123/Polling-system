import { IsString, IsNotEmpty, IsNumber,IsOptional } from 'class-validator';

export class CreateQuestionDto {
  @IsString({ each: true })
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsOptional()
  status: number;
}

export default CreateQuestionDto;
