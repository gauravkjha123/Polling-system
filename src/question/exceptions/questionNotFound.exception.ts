import { NotFoundException } from '@nestjs/common';

class QuestionNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Question with id ${id} not found`);
  }
}

export default QuestionNotFoundException;
