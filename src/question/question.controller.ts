import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import QuestionService from './question.service';
import CreateQuestionOptionDto from './dto/createQuestionOption.dto';
import CreateQuestionDto from './dto/createQuestion.dto';
import FindOneParams from '../utils/findOneParams';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';


@Controller('question')
@UseInterceptors(ClassSerializerInterceptor)
export default class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async getQuestions( ) {
    return this.questionService.getQuestions();
  }

  @Get('/:id')
  @UseGuards(JwtAuthenticationGuard)
  getQuestionById(@Param() { id }: FindOneParams) {
    return this.questionService.getQuestionById(Number(id));
  }

  @Post('/create')
  @UseGuards(JwtAuthenticationGuard)
  async createQuestion(@Body() question: CreateQuestionDto) {
    return this.questionService.createQuestion(question);
  }

  @Post('/:id/options/create')
  @UseGuards(JwtAuthenticationGuard)
  async createQuestionOption(@Param() { id }: FindOneParams,@Body() question: CreateQuestionOptionDto) {
    return this.questionService.createQuestionOption(Number(id),question);
  }

  @Delete(':id/delete')
  @UseGuards(JwtAuthenticationGuard)
  async deleteQuestion(@Param() { id }: FindOneParams) {
    return this.questionService.deleteQuestion(Number(id));
  }
}
