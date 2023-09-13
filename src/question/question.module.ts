import { Module } from '@nestjs/common';
import Question from './question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import QuestionController from './question.controller';
import QuestionService from './question.service';
import { OptionModule } from '../option/option.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question]),ConfigModule,OptionModule],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
