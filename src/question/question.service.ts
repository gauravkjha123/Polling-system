import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import Question from './question.entity';
import CreateQuestionDto from './dto/createQuestion.dto';
import CreateQuestionOptionDto from './dto/createQuestionOption.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import OptionService from '../option/option.service';
import QuestionNotFoundException from './exceptions/questionNotFound.exception';
import QuestionCanNotDeleteExecption from './exceptions/questionCanNotDelete.exception';

@Injectable()
export default class QuestionService {
  private readonly logger = new Logger(QuestionService.name);

  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private optionService: OptionService,
    private readonly configService: ConfigService,
  ) {}

  async getQuestionById(id: number) {
    const question = await this.questionRepository.findOne({
      where: { id: id },
      relations: { options: true },
    });
    if (question) {
      question.options.map((value) => {
        value['link_to_vote'] = `${this.route()}/option/${value.id}/add_vote`;
      });
      return question;
    }
    this.logger.warn('Tried to access a question that does not exist');
    throw new QuestionNotFoundException(id);
  }
  private route() {
    return (
      `${this.configService.get(
        'APP_SCHEMA',
      )}://${this.configService.get(
        'APP_HOST',
      )}:${this.configService.get('APP_PORT')}`
    );
  }

  async getQuestions() {
    const questions = await this.questionRepository.find({relations:{
      options:true
    }});
    if (!questions || questions.length==0) {
      return []
    }
    for (let index = 0; index < questions.length; index++) {
      questions[index].options.map((value) => {
        value['link_to_vote'] = `${this.route()}/option/${value.id}/add_vote`;
      });
    }
    return questions;
  }

  async createQuestion(question: CreateQuestionDto) {
    const newQuestion = this.questionRepository.create({
      ...question,
    });
    await this.questionRepository.save(newQuestion);
    return newQuestion;
  }

  async createQuestionOption(
    id: number,
    createQuestionOption: CreateQuestionOptionDto,
  ) {
    const question = await this.getQuestionById(id);
    if (!question) {
      this.logger.warn('Tried to access a question that does not exist');
      throw new QuestionNotFoundException(id);
    }
    let isExist=await this.optionService.getOptionByText(createQuestionOption.text);
    if (isExist) {
      throw new HttpException('Option Already Exist',HttpStatus.BAD_REQUEST)
    }
    await this.optionService.createOption({
      text: createQuestionOption.text,
      questionId: question.id,
    });
    return await this.getQuestionById(id);
  }

  async deleteQuestion(id: number) {
    let question = await this.getQuestionById(id);
    let isNotDeletable = question.options.some((value) => value.votes > 0);
    if (isNotDeletable) {
      this.logger.warn('This question can not be deleted');
      throw new QuestionCanNotDeleteExecption(id);
    }
    await this.optionService.deleteOption
    const deleteResponse = await this.questionRepository.delete(id);
    
    if (!deleteResponse.affected) {
      this.logger.warn('Tried to delete a question that does not exist');
      throw new QuestionNotFoundException(id);
    }
    return deleteResponse;
  }
}
