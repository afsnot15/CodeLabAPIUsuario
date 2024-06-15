import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class EnviarEmailDto {
  @IsNotEmpty()
  @IsDefined()
  @IsEmail()
  to: string | string[];

  @IsNotEmpty()
  @IsDefined()
  subject: any;

  @IsNotEmpty()
  @IsDefined()
  context: any;

  @IsNotEmpty()
  @IsDefined()
  template: string;
}
