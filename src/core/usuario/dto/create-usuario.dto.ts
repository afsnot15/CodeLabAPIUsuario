import { IsEmail, IsEmpty, IsNotEmpty, MaxLength } from 'class-validator';
import { EMensagem } from 'src/shared/enums/mensagem.enum';

export class CreateUsuarioDto {
  @IsEmpty({ message: `ID ${EMensagem.DeveSerVazio}` })
  id: number;

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
