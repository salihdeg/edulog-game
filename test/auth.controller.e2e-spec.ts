import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { User } from '../src/auth/user.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GameSession } from '../src/game/game-session.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: '990399',
          database: 'edulog-test-db',
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
          entities: [User, GameSession],
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'testuser_auth',
          password: 'hashedpassword',
        })
        .expect(201);

      expect(response.body).toEqual({});
    });

    it('should return 409 if username is already taken', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'testuser_auth',
          password: 'hashedpassword',
        })
        .expect(409);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login successfully and return an access token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'testuser_auth',
          password: 'hashedpassword',
        })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(typeof response.body.accessToken).toBe('string');
    });

    it('should return 401 if credentials are incorrect', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'testuser_auth',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should return 401 if user does not exist', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'nonexistentuser',
          password: 'somepassword',
        })
        .expect(401);
    });
  });
});
