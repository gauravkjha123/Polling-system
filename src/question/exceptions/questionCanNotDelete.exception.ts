import { NotFoundException } from '@nestjs/common';

class QuestionCanNotDeleteExecption extends NotFoundException {
  constructor(id: number) {
    super(`Question with id ${id} not deletable`);
  }
}

export default QuestionCanNotDeleteExecption;
