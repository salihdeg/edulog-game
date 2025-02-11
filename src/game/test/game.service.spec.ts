import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from '../game.service';
import { GamesRepository } from '../games.repository';
import { UsersRepository } from '../../auth/users.repository';
import { User } from '../../auth/user.entity';
import { NotFoundException } from '@nestjs/common';
import { SaveScoreDto } from '../dto/save-score.dto';
import { LeaderboardQueryDto } from '../../leaderboard/dto/leaderboard-query.dto';

const mockGameSession = {
  id: 1,
  user: { id: 1 },
  score: 10,
};

const mockGamesRepository = {
  findOne: jest.fn().mockResolvedValue(mockGameSession),
  save: jest.fn().mockResolvedValue(mockGameSession),
  startGame: jest.fn().mockResolvedValue(mockGameSession),
  getLeaderboard: jest.fn().mockResolvedValue([mockGameSession]),
};

const mockUsersRepository = {
  findOne: jest.fn().mockResolvedValue({ id: 1, username: 'testuser' }),
  save: jest
    .fn()
    .mockResolvedValue({ id: 1, username: 'testuser', highScore: 50 }),
};

describe('GameService', () => {
  let gameService: GameService;
  let gamesRepository;
  let usersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        { provide: GamesRepository, useValue: mockGamesRepository },
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    gameService = module.get<GameService>(GameService);
    gamesRepository = module.get<GamesRepository>(GamesRepository);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  describe('getGameSessionById', () => {
    it('should return a game session if found', async () => {
      const user = { id: 1 } as User;
      const result = await gameService.getGameSessionById(1, user);
      expect(result).toEqual(mockGameSession);
      expect(gamesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, user: { id: user.id } },
        relations: ['user'],
      });
    });

    it('should throw NotFoundException if session is not found', async () => {
      gamesRepository.findOne.mockResolvedValue(null);
      await expect(
        gameService.getGameSessionById(99, { id: 1 } as User),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('startGame', () => {
    it('should start a game session', async () => {
      const user = { id: 1 } as User;
      const result = await gameService.startGame(user);
      expect(result).toEqual(mockGameSession);
      expect(gamesRepository.startGame).toHaveBeenCalledWith(user);
    });
  });

  describe('saveScore', () => {
    it('should save score and return updated session', async () => {
      const user = { id: 1, username: 'testuser' } as User;
      gamesRepository.findOne.mockResolvedValue(mockGameSession);

      const scoreDto: SaveScoreDto = { gameSessionId: 1, score: 50 };

      const result = await gameService.saveScore(user, scoreDto);
      console.log(result);
      expect(result.score).toBe(50);
      expect(gamesRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if session not found', async () => {
      gamesRepository.findOne.mockResolvedValue(null);
      const user = { id: 1, username: 'testuser' } as User;
      const scoreDto: SaveScoreDto = { gameSessionId: 99, score: 50 };

      await expect(gameService.saveScore(user, scoreDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getLeaderboard', () => {
    it('should return leaderboard', async () => {
      const pageDto: LeaderboardQueryDto = { page: 1, limit: 10 };
      const result = await gameService.getLeaderboard(pageDto);
      expect(result).toEqual([mockGameSession]);
      expect(gamesRepository.getLeaderboard).toHaveBeenCalledWith(pageDto);
    });
  });
});
