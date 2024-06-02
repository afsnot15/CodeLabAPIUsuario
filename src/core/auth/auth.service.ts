import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { EMensagem } from '../../shared/enums/mensagem.enum';
import { ILoginPayload } from '../../shared/interfaces/login-payload.interface';
import { Usuario } from '../usuario/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  @InjectRepository(Usuario)
  private usuarioRepository: Repository<Usuario>;

  async login(LoginDto: LoginDto): Promise<ILoginPayload> {
    const finded = await this.usuarioRepository.findOne({
      select: ['id', 'email', 'nome', 'admin', 'senha'],
      where: { email: LoginDto.email },
    });

    const matchPassword = bcrypt.compareSync(LoginDto.senha, finded.senha);

    console.log(matchPassword);

    if (!finded || !matchPassword) {
      throw new HttpException(
        EMensagem.UsuarioSenhaInvalido,
        HttpStatus.UNAUTHORIZED,
      );
    }

    delete finded.senha;

    return { ...finded } as ILoginPayload;
  }
}
