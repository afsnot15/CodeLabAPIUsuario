import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('usuario_permissao')
export class UsuarioPermissao {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'pk_usuario_permissao' })
  id: number;

  @Column({ name: 'id_usuario', nullable: false })
  idUsuario: number;

  @Column({ nullable: false })
  modulo: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.id)
  @JoinColumn({
    name: 'id_usuario',
    foreignKeyConstraintName: 'fk_permissao_usuario',
  })
  usuario: Usuario;
}
