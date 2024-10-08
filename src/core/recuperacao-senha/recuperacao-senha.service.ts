import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnviarEmailDto } from '../../shared/dtos/enviar-email.dto';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateRecuperacaoSenhaDto } from './dto/create-recuperacao-senha.dto';
import { RecuperacaoSenha } from './entities/recuperacao-senha.entity';

@Injectable()
export class RecuperacaoSenhaService {
  @InjectRepository(RecuperacaoSenha)
  private repository: Repository<RecuperacaoSenha>;

  @InjectRepository(Usuario)
  private usuarioRepository: Repository<Usuario>;

  @Inject()
  private readonly configService: ConfigService;

  constructor(
    @Inject('MAIL_SERVICE')
    private readonly mailService: ClientProxy,
  ) {}

  async create(
    createRecuperacaoSenhaDto: CreateRecuperacaoSenhaDto,
  ): Promise<void> {
    const findedUsuario = await this.usuarioRepository.findOne({
      select: ['id', 'nome'],
      where: { email: createRecuperacaoSenhaDto.email },
    });

    if (findedUsuario) {
      console.log('Email encontrado: ' + findedUsuario.email);
      await this.repository.delete({ email: createRecuperacaoSenhaDto.email });

      const created = this.repository.create(createRecuperacaoSenhaDto);

      this.repository.save(created);

      const baseUrl = this.configService.get<string>('BASE_URL_FRONT');

      const data: EnviarEmailDto = {
        subject: 'Recuperação de senha',
        to: createRecuperacaoSenhaDto.email,
        template: 'recuperacao-senha',
        context: {
          nome: findedUsuario.nome,
          link: `${baseUrl}/recuperar-senha/`,
        },
      };

      this.mailService.emit('enviar-email', data);
    }
  }
}
