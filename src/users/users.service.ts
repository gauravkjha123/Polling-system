import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import User from './user.entity';
import CreateUserDto from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import LocalFilesService from '../localFiles/localFiles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private localFilesService: LocalFilesService,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getByIds(ids: number[]) {
    return this.usersRepository.find({
      where: { id: In(ids) },
      relations:{

        avatar:true
      }
    });
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({where:{id:id}, 
      relations:{
      avatar:true
    } });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: CreateUserDto) {
    const user = await this.usersRepository.findOne({where:{email:userData.email}, 
      relations:{
      avatar:true
    } });
    if (user) {
      throw new HttpException(
        'User with this email already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser = await this.usersRepository.create({
      ...userData,
    });
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async createWithGoogle(email: string, name: string) {
    const newUser = await this.usersRepository.create({
      email,
      firstName: name,
      isRegisteredWithGoogle: true,
    });
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async setPassword(email: string, password: string) {
    await this.usersRepository.update(
      { email },
      {
        password,
      },
    );
  }

  async setOtp(email: string, otp: string) {
    await this.usersRepository.update(
      { email },
      {
        otp,
      },
    );
  }
  
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async markEmailAsConfirmed(email: string) {
    return this.usersRepository.update(
      { email },
      {
        isEmailConfirmed: true,
      },
    );
  }

  markPhoneNumberAsConfirmed(userId: number) {
    return this.usersRepository.update(
      { id: userId },
      {
        isPhoneNumberConfirmed: true,
      },
    );
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async getUserById(userId: number) {
    let user= this.usersRepository.findOne({where:{id:userId}});
    if (!user) {
      throw new HttpException(
        'User does not exist',
        HttpStatus.NOT_FOUND,
      ); 
    }
  }
  async addAvatar(userId: number, fileData: LocalFileDto) {
    const avatar = await this.localFilesService.saveLocalFileData(fileData);
    await this.usersRepository.update(userId, {
      avatarId: avatar.id,
    });
    return avatar;
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.usersRepository.update(userId, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    return this.usersRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }
}
