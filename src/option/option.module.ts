import { Module } from '@nestjs/common';
import Option from './option.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import OptionController from './option.controller';
import OptionService from './option.service';

@Module({
  imports: [TypeOrmModule.forFeature([Option])],
  controllers: [OptionController],
  providers: [OptionService],
  exports:[OptionService]
})
export class OptionModule {}
