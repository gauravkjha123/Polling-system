import { NotFoundException } from '@nestjs/common';

class OptionCanNotDeleteExecption extends NotFoundException {
  constructor(id: number) {
    super(`OPtion with id ${id} not deletable`);
  }
}

export default OptionCanNotDeleteExecption;
