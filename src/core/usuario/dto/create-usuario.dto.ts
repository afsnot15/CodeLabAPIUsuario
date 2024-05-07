import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { EMensagem } from '../../../shared/enums/mensagem.enum';

export class CreateUsuarioDto {
  @IsNotEmpty({ message: `Nome ${EMensagem.NaoPodeSerVazio}` })
  @MaxLength(60, { message: `Nome ${EMensagem.MaisCaracteresQuePermitido}` })
  nome: string;

  @IsNotEmpty({ message: `Email ${EMensagem.NaoPodeSerVazio}` })
  @IsEmail({}, { message: `Email ${EMensagem.NaoValido}` })
  email: string;

  @IsNotEmpty({ message: `Senha ${EMensagem.NaoPodeSerVazio}` })
  senha: string;

  @IsNotEmpty({ message: `Ativo ${EMensagem.NaoPodeSerVazio}` })
  ativo: boolean;

  @IsNotEmpty({ message: `Admin ${EMensagem.NaoPodeSerVazio}` })
  admin: boolean;
}
