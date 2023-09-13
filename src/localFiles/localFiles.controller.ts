import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Res,
  StreamableFile,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import LocalFilesService from './localFiles.service';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
// import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';

@Controller('local-files')
@UseInterceptors(ClassSerializerInterceptor)
export default class LocalFilesController {
  constructor(private readonly localFilesService: LocalFilesService) {}

  @Get(':id')
  // @UseGuards(JwtAuthenticationGuard)
  async getDatabaseFileById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const file = await this.localFilesService.getFileById(id);

    const stream = createReadStream(join(process.cwd(), file.path));

    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': file.mimetype,
    });
    return new StreamableFile(stream);
  }
}
