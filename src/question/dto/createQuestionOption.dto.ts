import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateQuestionOptionDto {
  @IsString({ each: true })
  @IsNotEmpty()
  text: string;
}

export default CreateQuestionOptionDto;
