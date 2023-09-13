import { NotFoundException } from '@nestjs/common';

class OptionNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Option with id ${id} not found`);
  }
}

export default OptionNotFoundException;
