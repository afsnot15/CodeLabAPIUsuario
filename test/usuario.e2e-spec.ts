import { fakerPT_BR as faker } from '@faker-js/faker';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Usuario } from '../src/core/usuario/entities/usuario.entity';
import { EMensagem } from '../src/shared/enums/mensagem.enum';
import { ResponseExceptionsFilter } from '../src/shared/filters/response-exception.filter';
import { ResponseTransformInterceptor } from '../src/shared/interceptors/response-transform.interceptor';

describe('Usuario (e2e)', () => {
  let app: INestApplication;

  let repository: Repository<Usuario>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    app.useGlobalFilters(new ResponseExceptionsFilter());

    await app.startAllMicroservices();
    await app.init();

    repository = app.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  afterAll(async () => {
    await repository.delete({});
    await app.close();
  });

  describe('CRUD /usuario', () => {
    let id: number;

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const usuario = {
      nome: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      senha: faker.internet.password(),
      ativo: true,
      admin: false,
    };

    it('Criar um novo usuario', async () => {
      const response = await request(app.getHttpServer())
        .post('/usuario')
        .send(usuario);

      expect(response).toBeDefined();
      expect(response.body.message).toBe(EMensagem.SalvoComSucesso);
      expect(response.body.data).toHaveProperty('id');

      id = response.body.data.id;
    });

    it('Criar um novo usuario usando mesmo email', async () => {
      const response = await request(app.getHttpServer())
        .post('/usuario')
        .send(usuario);

      expect(response).toBeDefined();
      expect(response.status).toBe(HttpStatus.NOT_ACCEPTABLE);
      expect(response.body.message).toBe(EMensagem.ImpossivelCadastrar);
      expect(response.body.data).toBeNull();
    });

    it('carregar o usuario criado', async () => {
      const resp = await request(app.getHttpServer()).get(`/usuario/${id}`);

      expect(resp).toBeDefined();
      expect(resp.body.mensagem).toBe(undefined);
      expect(resp.body.message).toBe(null);
      expect(resp.body.data.email).toBe(usuario.email);
      expect(resp.body.data.ativo).toBe(usuario.ativo);
      expect(resp.body.data.admin).toBe(usuario.admin);
      expect(resp.body.data.password).toBe(undefined);
      expect(resp.body.data).toHaveProperty('permissao');
    });

    it('alterar um usuario criado', async () => {
      const usuarioAlterado = Object.assign(usuario, { id: id, admin: true });

      const resp = await request(app.getHttpServer())
        .patch(`/usuario/${id}`)
        .send(usuarioAlterado);

      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(EMensagem.AtualizadoComSucesso);
      expect(resp.body.data.admin).toBe(true);
    });

    it('lançar uma exceção ao alterar um usuario criado passando um id diferente', async () => {
      const usuarioAlterado = Object.assign(usuario, { id: id, admin: true });

      const resp = await request(app.getHttpServer())
        .patch(`/usuario/999`)
        .send(usuarioAlterado);

      expect(resp).toBeDefined();
      expect(resp.status).toBe(HttpStatus.NOT_ACCEPTABLE);
      expect(resp.body.message).toBe(EMensagem.IDsDivergente);
      expect(resp.body.data).toBe(null);
    });

    it('lançar uma exeção ao alterar um usuario utilizando um email já utilizado', async () => {
      const firstNameTemp = faker.person.firstName();
      const lastNameTemp = faker.person.lastName();

      const usuarioTemp = {
        nome: `${firstNameTemp} ${lastNameTemp}`,
        email: faker.internet
          .email({ firstName: firstNameTemp, lastName: lastNameTemp })
          .toLowerCase(),
        senha: faker.internet.password(),
        ativo: true,
        admin: false,
      };

      await request(app.getHttpServer()).post('/usuario').send(usuarioTemp);

      const usuarioAlterado = Object.assign(usuario, {
        email: usuarioTemp.email,
      });

      const resp = await request(app.getHttpServer())
        .patch(`/usuario/${id}`)
        .send(usuarioAlterado);

      expect(resp).toBeDefined();
      expect(resp.status).toBe(HttpStatus.NOT_ACCEPTABLE);
      expect(resp.body.message).toBe(EMensagem.ImpossivelAlterar);
      expect(resp.body.data).toBe(null);
    });

    it('desativar um usuario cadastrado', async () => {
      const resp = await request(app.getHttpServer()).delete(`/usuario/${id}`);

      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(EMensagem.DesativadoComSucesso);
      expect(resp.body.data).toBe(false);
    });

    it('lançar uma exceção ao desativar um usuario não cadastrado', async () => {
      const resp = await request(app.getHttpServer()).delete(`/usuario/999`);

      expect(resp).toBeDefined();
      expect(resp.status).toBe(HttpStatus.NOT_ACCEPTABLE);
      expect(resp.body.message).toBe(EMensagem.ImpossivelDesativar);
      expect(resp.body.data).toBe(null);
    });
  });

  describe('findAll /usuario', () => {
    it('obter todos os registros da página 1', async () => {
      for (let i = 0; i < 10; i++) {
        const firstNameTemp = faker.person.firstName();
        const lastNameTemp = faker.person.lastName();

        const usuarioTemp = {
          nome: `${firstNameTemp} ${lastNameTemp}`,
          email: faker.internet
            .email({ firstName: firstNameTemp, lastName: lastNameTemp })
            .toLowerCase(),
          senha: faker.internet.password(),
          ativo: true,
          admin: false,
        };

        await request(app.getHttpServer()).post('/usuario').send(usuarioTemp);
      }

      const order: string = JSON.stringify({ column: 'id', sort: 'asc' });

      const resp = await request(app.getHttpServer()).get(
        `/usuario/1/10/${order}`,
      );

      expect(resp).toBeDefined();
      expect(resp.body.mensagem).toBe(undefined);
      expect(resp.body.message).toBe(null);
      expect(resp.body.data.length).toBe(10);
    });

    it('obter todos os registros da página 2', async () => {
      const order: string = JSON.stringify({ column: 'id', sort: 'asc' });

      const resp = await request(app.getHttpServer()).get(
        `/usuario/2/10/${order}`,
      );

      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(null);
      expect(resp.body.mensagem).toBe(undefined);
      expect(resp.body.data.length).toBe(2);
    });

    it('obter usuário com base no filtro especificado', async () => {
      const order: string = JSON.stringify({ column: 'id', sort: 'asc' });

      const usuarioCadastrado = await request(app.getHttpServer()).get(
        `/usuario/1/1/${order}`,
      );

      const nomeFiltro = usuarioCadastrado.body.data[0].nome;
      const emailFiltro = usuarioCadastrado.body.data[0].email;

      console.log(nomeFiltro, emailFiltro);

      const filter = JSON.stringify([
        { column: 'nome', value: nomeFiltro },
        { column: 'email', value: emailFiltro },
      ]);

      const resp = await request(app.getHttpServer()).get(
        `/usuario/1/10/${order}?filter=${filter}`,
      );

      expect(resp).toBeDefined();
      expect(resp.body.mensagem).toBe(undefined);
      expect(resp.body.message).toBe(null);
      expect(resp.body.data.length).toBe(1);
      expect(resp.body.data[0].nome).toBe(nomeFiltro);
      expect(resp.body.data[0].email).toBe(emailFiltro);
    });
  });
});
