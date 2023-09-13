import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import Status from './enum/questionStatus.enum';
import Option from '../option/option.entity';

@Entity()
class Question {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({nullable:false,type:'varchar',length:255})
  public title: string;
  
  @Column({ 
    type:'enum',
    enum:Status,
    default:Status.ACTIVE
    })
  public status: number;

  @OneToMany(() => Option, (option) => option.question)
  options: Option[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

export default Question;
