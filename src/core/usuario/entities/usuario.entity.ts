import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { CreateUsuarioDto } from './../dto/create-usuario.dto';
import { UsuarioPermissao } from './usuario-permissao.entity';

@Entity('usuario')
@Unique('un_email', ['email'])
export class Usuario {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'pk_usuario' })
  id: number;

  @Column({ length: 60, nullable: false })
  nome: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  senha: string;

  @Column({ nullable: false })
  ativo: boolean;

  @Column({ nullable: false })
  admin: boolean;

  @OneToMany(
    () => UsuarioPermissao,
    (usuarioPermissao) => usuarioPermissao.usuario,
    {
      eager: true,
      onDelete: 'CASCADE',
      cascade: ['insert', 'update'],
      orphanedRowAction: 'delete',
    },
  )
  permissao: UsuarioPermissao[];

  constructor(createUsuarioDto: CreateUsuarioDto | UpdateUsuarioDto) {
    Object.assign(this, createUsuarioDto);
  }
}
