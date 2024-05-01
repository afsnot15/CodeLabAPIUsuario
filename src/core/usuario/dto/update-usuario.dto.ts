import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { EMensagem } from 'src/shared/enums/mensagem.enum';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(
  OmitType(CreateUsuarioDto, ['id'] as const),
) {
  @IsNotEmpty({ message: `ID ${EMensagem.NaoPodeSerVazio}` })
  id: number;
}
