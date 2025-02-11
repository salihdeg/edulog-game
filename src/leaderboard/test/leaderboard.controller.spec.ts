import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardController } from '../leaderboard.controller';
import { GameService } from '../../game/game.service';
import { LeaderboardQueryDto } from '../dto/leaderboard-query.dto';
import { GameSession } from '../../game/game-session.entity';
import { User } from '../../auth/user.entity';
import { LeaderBoardResponseDto } from '../dto/leaderboard-response.dto';

describe('LeaderboardController', () => {
  let controller: LeaderboardController;
  let gameService: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardController],
      providers: [
        {
          provide: GameService,
          useValue: {
            getLeaderboard: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LeaderboardController>(LeaderboardController);
    gameService = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLeaderboard', () => {
    it('should return leaderboard data with page details', async () => {
      const pageDto: LeaderboardQueryDto = { page: 1, limit: 10 };
      const leaderboardResponse: LeaderBoardResponseDto = {
        data: [
          {
            id: 1,
            score: 100,
            createdAt: new Date(),
            userId: 1,
            username: 'user1',
          },
        ],
        page: 1,
        limit: 10,
        pageCount: 1,
        total: 1,
      };
      jest
        .spyOn(gameService, 'getLeaderboard')
        .mockResolvedValue(leaderboardResponse);

      const result = await controller.getLeaderboard(pageDto);
      expect(result).toEqual(leaderboardResponse);
      expect(gameService.getLeaderboard).toHaveBeenCalledWith(pageDto);
    });
  });
});
