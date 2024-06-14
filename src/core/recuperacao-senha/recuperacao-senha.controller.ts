import { Body, Controller, Post } from '@nestjs/common';
import { HttpResponse } from '../../shared/classes/http-response';
import { EMensagem } from '../../shared/enums/mensagem.enum';
import { IResponse } from '../../shared/interfaces/response.interface';
import { CreateRecuperacaoSenhaDto } from './dto/create-recuperacao-senha.dto';
import { RecuperacaoSenhaService } from './recuperacao-senha.service';

//Senha App: efkk soci rvmi vfel

/**
 * Como usar
 * Acesse as configurações da sua Conta do Google no aplicativo ou dispositivo que você está tentando configurar. Substitua sua senha pela senha de 16 caracteres mostrada acima.
 * Assim como sua senha normal, esta senha de app concede acesso total à sua Conta do Google. Não é necessário memorizá-la, por isso não a anote ou a compartilhe com outras pessoas.
 */

@Controller('recuperacao-senha')
export class RecuperacaoSenhaController {
  constructor(
    private readonly recuperacaoSenhaService: RecuperacaoSenhaService,
  ) {}

  @Post()
  async create(
    @Body() createRecuperacaoSenhaDto: CreateRecuperacaoSenhaDto,
  ): Promise<IResponse<boolean>> {
    await this.recuperacaoSenhaService.create(createRecuperacaoSenhaDto);

    return new HttpResponse<boolean>(true).onSucess(
      EMensagem.VerifiqueEnderecoEmail,
    );
  }
}
