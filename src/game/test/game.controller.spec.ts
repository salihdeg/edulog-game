import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from '../game.controller';
import { GameService } from '../game.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/decorator/get-user.decorator';
import { User } from '../../auth/user.entity';
import { SaveScoreDto } from '../dto/save-score.dto';
import { PassportModule } from '@nestjs/passport';

describe('GameController', () => {
  let gameController: GameController;
  let gameService: GameService;

  const mockGameService = {
    startGame: jest.fn(),
    saveScore: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    password: 'testpassword',
    highScore: 0,
    gameSessions: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [GameController],
      providers: [{ provide: GameService, useValue: mockGameService }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    gameController = module.get<GameController>(GameController);
    gameService = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(gameController).toBeDefined();
  });

  describe('startGame', () => {
    it('should call gameService.startGame with the correct user', async () => {
      await gameController.startGame(mockUser);
      expect(gameService.startGame).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('saveScore', () => {
    it('should call gameService.saveScore with the correct user and scoreDto', async () => {
      const scoreDto: SaveScoreDto = { gameSessionId: 1, score: 100 };
      await gameController.saveScore(mockUser, scoreDto);
      expect(gameService.saveScore).toHaveBeenCalledWith(mockUser, scoreDto);
    });
  });
});
