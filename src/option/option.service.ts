import { HttpException, HttpStatus, Injectable, Logger} from "@nestjs/common";
import Option from "./option.entity";
import CreateOptionDto from "./dto/createOption.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import OptionNotFoundException from "./exceptions/optionNotFound.exception";
import OptionCanNotDeleteExecption from "./dto/optionCanNotDelete.exception";

@Injectable()
export default class OptionService {
  private readonly logger = new Logger(OptionService.name);

  constructor(
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
  ) {}

  async getOptionByText(text:string) {
    const option = this.optionRepository.findOne({
      where:{text},
    });
    if (!option) {
      throw new HttpException('Option does not exist with',HttpStatus.BAD_REQUEST);
    }
    return option;
  }

  async createOption(option: CreateOptionDto) {
    const newreOption = this.optionRepository.create({
      ...option,
    });
    await this.optionRepository.save(newreOption);
    return newreOption;
  }

  async updateOptionVote(id: number) {
    const option = await this.optionRepository.findOne({
      where: {
        id,
      },
    });
    if (!option) {
      this.logger.warn('Tried to access a option that does not  ');
      throw new OptionNotFoundException(id);
    }
    await this.optionRepository.update(id, {votes:option.votes+1});
    return await this.optionRepository.findOne({where:{id}});
  }

  async deleteOption(id: number) {
    let option=await this.optionRepository.findOne({where:{id:id}})
    if (!option) {
      this.logger.warn('Tried to delete a option that does not  ');
      throw new OptionNotFoundException(id);
    }
    let isNotDeletable = option.votes>0;
    if (isNotDeletable) {
      throw new OptionCanNotDeleteExecption(id);
    }
    const deleteResponse = await this.optionRepository.delete(id);
    if (!deleteResponse.affected) {
      this.logger.warn('Tried to delete a option that does not exist');
      throw new OptionNotFoundException(id);
    }
    return deleteResponse;
  }

}
