import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/auth/user.entity';
import { GameSession } from '../src/game/game-session.entity';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('LeaderboardController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let gameSessionRepository: Repository<GameSession>;
  let gameSession1;
  let gameSession2;

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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    gameSessionRepository = moduleFixture.get<Repository<GameSession>>(
      getRepositoryToken(GameSession),
    );

    const user1 = userRepository.create({
      username: 'player1',
      password: 'hashedpassword',
    });
    const user2 = userRepository.create({
      username: 'player2',
      password: 'hashedpassword',
    });
    await userRepository.save([user1, user2]);

    gameSession1 = gameSessionRepository.create({
      user: user1,
      score: 100,
    });
    gameSession2 = gameSessionRepository.create({
      user: user2,
      score: 200,
    });
    await gameSessionRepository.save([gameSession1, gameSession2]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/leaderboard (GET)', () => {
    it('should return the leaderboard', async () => {
      const response = await request(app.getHttpServer())
        .get('/leaderboard')
        .expect(200);

      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ score: 200, id: gameSession2.id }),
          expect.objectContaining({ score: 100, id: gameSession1.id }),
        ]),
      );
    });
  });
});
