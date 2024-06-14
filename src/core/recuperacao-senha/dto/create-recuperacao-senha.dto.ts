import { IsEmail, IsNotEmpty } from 'class-validator';
import { EMensagem } from '../../../shared/enums/mensagem.enum';

export class CreateRecuperacaoSenhaDto {
  @IsEmail({}, { message: `${EMensagem.NaoValido}` })
  @IsNotEmpty({ message: `${EMensagem.NaoPodeSerVazio}` })
  email: string;
}
