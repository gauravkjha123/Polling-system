import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  Get,
} from '@nestjs/common';
import SendEmailDto from './sendEmail.dto';
import { EmailConfirmationService } from './emailConfirmation.service';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import RequestWithUser from '../authentication/requestWithUser.interface';

@Controller('email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('send-email')
  async sendEmail(@Body() emailData: SendEmailDto) {
    const email = await this.emailConfirmationService.sendVerificationLink(
      emailData.email,
    );
  }

  @Get('confirm')
  async confirm(@Query('token') token: string) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      token,
    );
    await this.emailConfirmationService.confirmEmail(email);
  }

  @Post('resend-confirmation-link')
  @UseGuards(JwtAuthenticationGuard)
  async resendConfirmationLink(@Req() request: RequestWithUser) {
    await this.emailConfirmationService.resendConfirmationLink(request.user.id);
  }
}
