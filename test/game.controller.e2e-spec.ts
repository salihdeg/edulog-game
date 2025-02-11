import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { User } from '../src/auth/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSession } from '../src/game/game-session.entity';
import { AuthModule } from '../src/auth/auth.module';

describe('GameController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let accessToken: string;

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
        TypeOrmModule.forFeature([GameSession, User]),
        AppModule,
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get('UserRepository');
    jwtService = moduleFixture.get(JwtService);

    const testUser = userRepository.create({
      username: 'testuser_game',
      password: 'hashedpassword',
    });
    await userRepository.save(testUser);

    accessToken = jwtService.sign({
      id: testUser.id,
      username: testUser.username,
    });
  });

  it('/game/start (POST)', () => {
    return request(app.getHttpServer())
      .post('/game/start')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
      });
  });

  it('/game/score (POST)', () => {
    return request(app.getHttpServer())
      .post('/game/score')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ score: 100 })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
