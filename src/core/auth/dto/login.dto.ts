import { IsEmail, IsNotEmpty } from 'class-validator';
import { EMensagem } from '../../../shared/enums/mensagem.enum';

export class LoginDto {
  @IsEmail({}, { message: `${EMensagem.NaoValido}` })
  @IsNotEmpty({ message: `${EMensagem.NaoPodeSerVazio}` })
  email: string;

  @IsNotEmpty({ message: `${EMensagem.NaoPodeSerVazio}` })
  senha: string;
}
