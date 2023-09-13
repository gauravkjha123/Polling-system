import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import OptionService from './option.service';
import FindOneParams from '../utils/findOneParams';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';

@Controller('option')
@UseInterceptors(ClassSerializerInterceptor)
export default class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Get(':id/add_vote')
  @UseGuards(JwtAuthenticationGuard)
  async updateOptionVote(@Param() { id }: FindOneParams) {
    return this.optionService.updateOptionVote(Number(id));
  }
  
  @Delete(':id/delete')
  @UseGuards(JwtAuthenticationGuard)
  async deleteOption(@Param() { id }: FindOneParams) {
    return this.optionService.deleteOption(Number(id));
  }
}
