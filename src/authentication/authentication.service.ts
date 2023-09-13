import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import RegisterDto from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import TokenPayload from './tokenPayload.interface';
import sendOtp from './dto/sendOtp.dto';
import ForgetPassword from './dto/forgetPassword.dto';
import { EmailConfirmationService } from '../emailConfirmation/emailConfirmation.service';
import { generate } from 'otp-generator';
import ChangePassword from './dto/changetPassword.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      await this.emailConfirmationService.sendVerificationLink(
        registrationData.email,
      );
      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  public async sendOtp(sendOtpData: sendOtp): Promise<any> {
    try {
      const user = await this.usersService.getByEmail(sendOtpData.email);
      if (!user) {
        throw new HttpException(
          'User does not exist with email',
          HttpStatus.BAD_REQUEST,
        );
      }
      const otp: string = generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      await this.emailConfirmationService.sendOtp(
        sendOtpData.email,
        sendOtpData.subject,
        otp,
      );
      await this.usersService.setOtp(sendOtpData.email, otp);
      return true;
    } catch (error) {
      return error;
    }
  }

  public async forgetPassword(
    forgetPasswordDate: ForgetPassword,
  ): Promise<any> {
    try {
      const user = await this.usersService.getByEmail(forgetPasswordDate.email);
      if (!user) {
        throw new HttpException(
          'User does not exist with email',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        forgetPasswordDate.newPasssword !== forgetPasswordDate.confirmPassword
      ) {
        throw new HttpException('Passwords mismatch ', HttpStatus.BAD_REQUEST);
      }
      if (user.otp !== forgetPasswordDate.otp) {
        throw new HttpException('Invalid otp', HttpStatus.BAD_REQUEST);
      }
      const hashedPassword = await bcrypt.hash(
        forgetPasswordDate.newPasssword,
        10,
      );
      await this.usersService.setPassword(
        forgetPasswordDate.email,
        hashedPassword,
      );
      return true;
    } catch (error) {
      return error;
    }
  }

  public async changePassword(userId:number,
    changePasswordBody: ChangePassword,
  ): Promise<any> {
    try {
      const user = await this.usersService.getById(userId);
      if (!user) {
        throw new HttpException(
          'User does not exist with email',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        changePasswordBody.newPasssword !== changePasswordBody.confirmPassword
      ) {
        throw new HttpException('New password and confirm passsword mismatch', HttpStatus.BAD_REQUEST);
      }
      await this.verifyPassword(changePasswordBody.oldPassword,user.password);
      const hashedPassword = await bcrypt.hash(
        changePasswordBody.newPasssword,
        10,
      );
      await this.usersService.setPassword(
        user.email,
        hashedPassword,
      );
      return {status:true,massage:"Password change succrefully"};
    } catch (error) {
      throw error;
    }
  }

  public getCookieWithJwtAccessToken(
    userId: number,
    isSecondFactorAuthenticated = false,
  ) {
    const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;
  }

  public getCookieWithJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;
    return {
      cookie,
      token,
    };
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      if (!user) {
        throw new HttpException('User not resistered', HttpStatus.BAD_REQUEST);
      }
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async getUserFromAuthenticationToken(token: string) {
    const payload: TokenPayload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
    if (payload.userId) {
      return this.usersService.getById(payload.userId);
    }
  }
}
