import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QuestionModule } from './question/question.module';
import { OptionModule } from './option/option.module';
import { DatabaseModule } from './database/database.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { EmailConfirmationModule } from './emailConfirmation/emailConfirmation.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    QuestionModule,
    ConfigModule.forRoot(),
    OptionModule,
    DatabaseModule,
    UsersModule,
    AuthenticationModule,
    EmailConfirmationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
