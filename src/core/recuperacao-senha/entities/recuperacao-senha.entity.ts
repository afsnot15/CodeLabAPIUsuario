import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'recuperacaosenha' })
export class RecuperacaoSenha {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk_recuperacao_senha',
  })
  id: string;

  @Column()
  email: string;

  @CreateDateColumn()
  dataCriacao: Date;
}
