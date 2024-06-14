import { IsEmail, IsNotEmpty } from 'class-validator';
import { EMensagem } from '../../../shared/enums/mensagem.enum';

export class AlterarSenhaUsuarioDto {
  @IsNotEmpty({ message: `Email ${EMensagem.NaoPodeSerVazio}` })
  @IsEmail({}, { message: `Email ${EMensagem.NaoValido}` })
  email: string;

  @IsNotEmpty({ message: `Senha ${EMensagem.NaoPodeSerVazio}` })
  senha: string;

  @IsNotEmpty({ message: `Token ${EMensagem.NaoPodeSerVazio}` })
  token: string;
}
