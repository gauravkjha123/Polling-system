import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import Question from '../question/question.entity';

@Entity()
class Option {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({nullable:false,type:'varchar',length:255})
  public text: string;
  
  @Column({nullable:false,type:'int',width:10,default:0})
  public votes: number;

  @Column({ nullable: true })
  public questionId?: number;

  @JoinColumn({ name: 'questionId' })
  @ManyToOne(() => Question, (question) => question.options,{onDelete: "CASCADE"})
  question: Question

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

export default Option;
